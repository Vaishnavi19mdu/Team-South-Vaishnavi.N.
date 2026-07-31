import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TimelineStep {
  id: string;
  label: string;
  completed: boolean;
  time?: string;
}

export interface WorkPass {
  id: string; // e.g. MWP-2026-1048
  complaintId: string; // e.g. VAI-1082
  complaintTitle: string;
  employeeName: string;
  employeeId: string;
  role: string;
  department: string;
  room: string;
  block: string;
  residentName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  generatedTime: string;
  validFrom: string;
  validUntil: string;
  expiryTimestamp: number; // Date.now() + duration
  status: 'ACTIVE' | 'EXPIRED' | 'EXTENDED' | 'COMPLETED';
  extensionStatus: 'None' | 'Pending' | 'Approved' | 'Rejected';
  extensionReason?: string;
  requestedExtensionMinutes?: number;
  proofAttachment?: string;
  entryTime?: string;
  exitTime?: string;
  totalDuration?: string;
  extendedByWarden?: boolean;
  extensionRejectionReason?: string;
  timeline: TimelineStep[];
}

interface WorkPassContextType {
  passes: WorkPass[];
  activePass: WorkPass | null;
  setActivePass: (pass: WorkPass | null) => void;
  generatePassForTask: (task: {
    id: string;
    title: string;
    residentName: string;
    room: string;
    block: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    estimatedDuration?: string;
  }) => WorkPass;
  requestExtension: (
    passId: string,
    reason: string,
    additionalMinutes: number,
    proofImg?: string
  ) => void;
  approveExtension: (passId: string) => void;
  rejectExtension: (passId: string, reason?: string) => void;
  recordSecurityEntry: (passId: string) => void;
  recordSecurityExit: (passId: string) => void;
  markTaskProgressInPass: (passId: string, progressStep: 'started' | 'completed') => void;
  getPassByComplaintId: (complaintId: string) => WorkPass | undefined;
}

const initialTimeline: TimelineStep[] = [
  { id: '1', label: 'Complaint Submitted', completed: true, time: 'Today, 09:00 AM' },
  { id: '2', label: 'AI Categorized', completed: true, time: 'Today, 09:01 AM' },
  { id: '3', label: 'Approved by Warden', completed: true, time: 'Today, 09:10 AM' },
  { id: '4', label: 'Maintenance Assigned', completed: true, time: 'Today, 09:15 AM' },
  { id: '5', label: 'Task Accepted', completed: true, time: 'Today, 09:30 AM' },
  { id: '6', label: 'Work Pass Generated', completed: true, time: 'Today, 09:30 AM' },
  { id: '7', label: 'Security Entry', completed: false },
  { id: '8', label: 'Repair Started', completed: false },
  { id: '9', label: 'Repair Completed', completed: false },
  { id: '10', label: 'Security Exit', completed: false },
  { id: '11', label: 'Complaint Closed', completed: false },
];

const defaultPasses: WorkPass[] = [
  {
    id: 'MWP-2026-1082',
    complaintId: 'VAI-1082',
    complaintTitle: 'Water Leakage in Washroom Pipe',
    employeeName: 'Manoj Kumar',
    employeeId: 'EMP-104',
    role: 'Electrician & Maintenance Tech',
    department: 'Hostel Maintenance Staff',
    room: 'Room B-204',
    block: 'Block B',
    residentName: 'Vaishnavi S',
    priority: 'High',
    generatedTime: 'Today, 09:30 AM',
    validFrom: '10:30 AM',
    validUntil: '12:30 PM',
    expiryTimestamp: Date.now() + 1000 * 60 * 110, // 1 hr 50 mins from now
    status: 'ACTIVE',
    extensionStatus: 'None',
    entryTime: '11:02 AM',
    timeline: [
      { id: '1', label: 'Complaint Submitted', completed: true, time: 'Today, 09:00 AM' },
      { id: '2', label: 'AI Categorized', completed: true, time: 'Today, 09:01 AM' },
      { id: '3', label: 'Approved by Warden', completed: true, time: 'Today, 09:10 AM' },
      { id: '4', label: 'Maintenance Assigned', completed: true, time: 'Today, 09:15 AM' },
      { id: '5', label: 'Task Accepted', completed: true, time: 'Today, 09:30 AM' },
      { id: '6', label: 'Work Pass Generated', completed: true, time: 'Today, 09:30 AM' },
      { id: '7', label: 'Security Entry', completed: true, time: 'Today, 11:02 AM' },
      { id: '8', label: 'Repair Started', completed: true, time: 'Today, 11:15 AM' },
      { id: '9', label: 'Repair Completed', completed: false },
      { id: '10', label: 'Security Exit', completed: false },
      { id: '11', label: 'Complaint Closed', completed: false },
    ],
  },
  {
    id: 'MWP-2026-1074',
    complaintId: 'VAI-1074',
    complaintTitle: 'Switch Board Sparking Fault',
    employeeName: 'Manoj Kumar',
    employeeId: 'EMP-104',
    role: 'Electrician & Maintenance Tech',
    department: 'Hostel Maintenance Staff',
    room: 'Room C-301',
    block: 'Block C',
    residentName: 'Arjun Das',
    priority: 'Critical',
    generatedTime: 'Today, 07:45 AM',
    validFrom: '08:00 AM',
    validUntil: '10:00 AM',
    expiryTimestamp: Date.now() - 1000 * 60 * 15, // Expired 15 mins ago
    status: 'EXPIRED',
    extensionStatus: 'Pending',
    extensionReason: 'Main circuit breaker panel replacement required additional isolation testing.',
    requestedExtensionMinutes: 60,
    proofAttachment: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    entryTime: '08:15 AM',
    timeline: [
      { id: '1', label: 'Complaint Submitted', completed: true, time: 'Today, 07:30 AM' },
      { id: '2', label: 'AI Categorized', completed: true, time: 'Today, 07:32 AM' },
      { id: '3', label: 'Approved by Warden', completed: true, time: 'Today, 07:40 AM' },
      { id: '4', label: 'Maintenance Assigned', completed: true, time: 'Today, 07:45 AM' },
      { id: '5', label: 'Task Accepted', completed: true, time: 'Today, 07:45 AM' },
      { id: '6', label: 'Work Pass Generated', completed: true, time: 'Today, 07:45 AM' },
      { id: '7', label: 'Security Entry', completed: true, time: 'Today, 08:15 AM' },
      { id: '8', label: 'Repair Started', completed: true, time: 'Today, 08:30 AM' },
      { id: '9', label: 'Repair Completed', completed: false },
      { id: '10', label: 'Security Exit', completed: false },
      { id: '11', label: 'Complaint Closed', completed: false },
    ],
  },
];

const WorkPassContext = createContext<WorkPassContextType | undefined>(undefined);

export const WorkPassProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [passes, setPasses] = useState<WorkPass[]>(defaultPasses);
  const [activePass, setActivePass] = useState<WorkPass | null>(defaultPasses[0]);

  // Check pass expiration periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setPasses((prev) =>
        prev.map((p) => {
          if (p.status === 'ACTIVE' && p.expiryTimestamp <= now) {
            return {
              ...p,
              status: 'EXPIRED',
            };
          }
          return p;
        })
      );
    }, 10000); // Check every 10 seconds

    return () => clearInterval(timer);
  }, []);

  const generatePassForTask = (task: {
    id: string;
    title: string;
    residentName: string;
    room: string;
    block: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    estimatedDuration?: string;
  }): WorkPass => {
    // Check if pass already exists
    const existing = passes.find((p) => p.complaintId === task.id);
    if (existing) {
      setActivePass(existing);
      return existing;
    }

    const now = new Date();
    const formattedFrom = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Duration in minutes default 120 mins (2 hours)
    const durationMs = 120 * 60 * 1000;
    const expiryTime = new Date(now.getTime() + durationMs);
    const formattedUntil = expiryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const passNum = Math.floor(1000 + Math.random() * 9000);
    const newPassId = `MWP-2026-${passNum}`;

    const newTimeline: TimelineStep[] = [
      { id: '1', label: 'Complaint Submitted', completed: true, time: 'Earlier Today' },
      { id: '2', label: 'AI Categorized', completed: true, time: 'Earlier Today' },
      { id: '3', label: 'Approved by Warden', completed: true, time: 'Earlier Today' },
      { id: '4', label: 'Maintenance Assigned', completed: true, time: 'Earlier Today' },
      { id: '5', label: 'Task Accepted', completed: true, time: formattedFrom },
      { id: '6', label: 'Work Pass Generated', completed: true, time: formattedFrom },
      { id: '7', label: 'Security Entry', completed: false },
      { id: '8', label: 'Repair Started', completed: false },
      { id: '9', label: 'Repair Completed', completed: false },
      { id: '10', label: 'Security Exit', completed: false },
      { id: '11', label: 'Complaint Closed', completed: false },
    ];

    const newPass: WorkPass = {
      id: newPassId,
      complaintId: task.id,
      complaintTitle: task.title,
      employeeName: 'Manoj Kumar',
      employeeId: 'EMP-104',
      role: 'Electrician & Maintenance Tech',
      department: 'Hostel Maintenance Staff',
      room: task.room,
      block: task.block,
      residentName: task.residentName,
      priority: task.priority,
      generatedTime: `Today, ${formattedFrom}`,
      validFrom: formattedFrom,
      validUntil: formattedUntil,
      expiryTimestamp: now.getTime() + durationMs,
      status: 'ACTIVE',
      extensionStatus: 'None',
      timeline: newTimeline,
    };

    setPasses((prev) => [newPass, ...prev]);
    setActivePass(newPass);
    return newPass;
  };

  const requestExtension = (
    passId: string,
    reason: string,
    additionalMinutes: number,
    proofImg?: string
  ) => {
    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          return {
            ...p,
            extensionStatus: 'Pending',
            extensionReason: reason,
            requestedExtensionMinutes: additionalMinutes,
            proofAttachment: proofImg || p.proofAttachment,
          };
        }
        return p;
      })
    );

    // Update active pass if same
    if (activePass && activePass.id === passId) {
      setActivePass((prev) =>
        prev
          ? {
              ...prev,
              extensionStatus: 'Pending',
              extensionReason: reason,
              requestedExtensionMinutes: additionalMinutes,
              proofAttachment: proofImg || prev.proofAttachment,
            }
          : null
      );
    }
  };

  const approveExtension = (passId: string) => {
    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          const addMinutes = p.requestedExtensionMinutes || 60;
          const newExpiry = p.expiryTimestamp + addMinutes * 60 * 1000;
          const newUntilDate = new Date(newExpiry);
          const formattedUntil = newUntilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            ...p,
            status: 'EXTENDED',
            extensionStatus: 'Approved',
            expiryTimestamp: newExpiry,
            validUntil: formattedUntil,
            extendedByWarden: true,
          };
        }
        return p;
      })
    );

    if (activePass && activePass.id === passId) {
      const addMinutes = activePass.requestedExtensionMinutes || 60;
      const newExpiry = activePass.expiryTimestamp + addMinutes * 60 * 1000;
      const newUntilDate = new Date(newExpiry);
      const formattedUntil = newUntilDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setActivePass({
        ...activePass,
        status: 'EXTENDED',
        extensionStatus: 'Approved',
        expiryTimestamp: newExpiry,
        validUntil: formattedUntil,
        extendedByWarden: true,
      });
    }
  };

  const rejectExtension = (passId: string, reason?: string) => {
    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          return {
            ...p,
            status: 'EXPIRED',
            extensionStatus: 'Rejected',
            extensionRejectionReason: reason || 'Extension rejected by Warden.',
          };
        }
        return p;
      })
    );

    if (activePass && activePass.id === passId) {
      setActivePass({
        ...activePass,
        status: 'EXPIRED',
        extensionStatus: 'Rejected',
        extensionRejectionReason: reason || 'Extension rejected by Warden.',
      });
    }
  };

  const recordSecurityEntry = (passId: string) => {
    const entryFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          const updatedTimeline = p.timeline.map((step) =>
            step.id === '7' ? { ...step, completed: true, time: entryFormatted } : step
          );
          return {
            ...p,
            entryTime: entryFormatted,
            timeline: updatedTimeline,
          };
        }
        return p;
      })
    );
  };

  const recordSecurityExit = (passId: string) => {
    const exitFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const durationStr = '1 Hour 26 Minutes';

    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          const updatedTimeline = p.timeline.map((step) => {
            if (step.id === '10') return { ...step, completed: true, time: exitFormatted };
            if (step.id === '11') return { ...step, completed: true, time: exitFormatted };
            return step;
          });
          return {
            ...p,
            exitTime: exitFormatted,
            totalDuration: durationStr,
            status: 'COMPLETED',
            timeline: updatedTimeline,
          };
        }
        return p;
      })
    );
  };

  const markTaskProgressInPass = (passId: string, progressStep: 'started' | 'completed') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setPasses((prev) =>
      prev.map((p) => {
        if (p.id === passId) {
          const updatedTimeline = p.timeline.map((step) => {
            if (progressStep === 'started' && step.id === '8') {
              return { ...step, completed: true, time: nowTime };
            }
            if (progressStep === 'completed' && step.id === '9') {
              return { ...step, completed: true, time: nowTime };
            }
            return step;
          });
          return { ...p, timeline: updatedTimeline };
        }
        return p;
      })
    );
  };

  const getPassByComplaintId = (complaintId: string) => {
    return passes.find((p) => p.complaintId === complaintId);
  };

  return (
    <WorkPassContext.Provider
      value={{
        passes,
        activePass,
        setActivePass,
        generatePassForTask,
        requestExtension,
        approveExtension,
        rejectExtension,
        recordSecurityEntry,
        recordSecurityExit,
        markTaskProgressInPass,
        getPassByComplaintId,
      }}
    >
      {children}
    </WorkPassContext.Provider>
  );
};

export const useWorkPass = () => {
  const context = useContext(WorkPassContext);
  if (!context) {
    throw new Error('useWorkPass must be used within a WorkPassProvider');
  }
  return context;
};
