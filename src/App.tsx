/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from './utils/constants/roles';
import Navbar from './components/layout/Navbar';
import LandingScreen from './screens/auth/LandingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RoleSelectionScreen from './screens/auth/RoleSelectionScreen';
import SignupBasicScreen, { SignupBasicData } from './screens/auth/SignupBasicScreen';
import SignupHostelScreen, { SignupHostelData } from './screens/auth/SignupHostelScreen';
import PendingApprovalScreen from './screens/auth/PendingApprovalScreen';
import ResidentDashboard from './screens/app/ResidentDashboard';
import WardenDashboard from './screens/app/WardenDashboard';
import MaintenanceDashboard from './screens/app/MaintenanceDashboard';
import SecurityDashboard from './screens/app/SecurityDashboard';
import SuperAdminDashboard from './screens/app/SuperAdminDashboard';
import { ToastProvider } from './context/ToastContext';
import { WorkPassProvider } from './context/WorkPassContext';
import { CircleProvider } from './context/CircleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SosProvider } from './context/SosContext';
import { VisitorPassProvider } from './context/VisitorPassContext';

type AppRoute =
  | 'landing' | 'login' | 'role-selection' | 'signup-step-1' | 'signup-step-2' | 'pending-approval'
  | 'resident-dashboard' | 'warden-dashboard' | 'maintenance-dashboard' | 'security-dashboard' | 'superadmin-dashboard';

function AppContent() {
  const [activeRoute, setActiveRoute] = useState<AppRoute>('landing');

  const [selectedRole, setSelectedRole] = useState<UserRole>('resident');

  const [basicData, setBasicData] = useState<SignupBasicData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [hostelData, setHostelData] = useState<SignupHostelData>({
    hostelBlock: '',
    floorNumber: '',
    roomNumber: '',
    emergencyName: '',
    emergencyNumber: '',
  });

  // Real Firebase-backed auth state — profile is the Firestore users/{uid} doc
  // (role, isAdmin, status: 'pending' | 'approved' | 'rejected').
  const { profile, signup, logout } = useAuth();

  // Signup completion:
  // - resident -> account is created with status:'approved' -> straight to dashboard
  // - warden / maintenance / security -> account created with status:'pending'
  //   -> Pending Approval Screen until SuperAdmin flips status to 'approved'
  const handleCompleteSignup = async (role: UserRole, data: SignupHostelData) => {
    setHostelData(data);
    try {
      // authService.signUp already sets status: 'pending' | 'approved' based on
      // ROLES[role].requiresApproval — no need to duplicate that check here.
      const newProfile = await signup(role, basicData, data);
      if (newProfile.status === 'pending') {
        setActiveRoute('pending-approval');
      } else {
        setActiveRoute('resident-dashboard');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      // TODO: surface via ToastProvider once wired into SignupHostelScreen
    }
  };

  // Routes to the correct dashboard using the real Firestore profile
  // (role + approval status) rather than guessing from the typed email.
  const handleLoginSuccess = () => {
    if (!profile) return;

    if (profile.role !== 'superadmin' && profile.status !== 'approved') {
      setActiveRoute('pending-approval');
      return;
    }

    switch (profile.role) {
      case 'superadmin':
        setActiveRoute('superadmin-dashboard');
        break;
      case 'warden':
        setActiveRoute('warden-dashboard');
        break;
      case 'maintenance':
        setActiveRoute('maintenance-dashboard');
        break;
      case 'security':
        setActiveRoute('security-dashboard');
        break;
      default:
        setActiveRoute('resident-dashboard');
    }
  };

  const handleLogout = async () => {
    await logout();
    setActiveRoute('login');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col font-body antialiased">

      
      {/* Global Top Navbar on Public Pages */}
      {activeRoute !== 'resident-dashboard' && activeRoute !== 'warden-dashboard' && activeRoute !== 'maintenance-dashboard' && activeRoute !== 'security-dashboard' && activeRoute !== 'superadmin-dashboard' && (
        <Navbar
          onNavigate={(r) => setActiveRoute(r as any)}
          activeRoute={activeRoute}
        />
      )}

      {/* Active Screen View */}
      <div className="flex-1">
        {activeRoute === 'landing' && (
          <LandingScreen
            onNavigate={(r) => setActiveRoute(r as any)}
          />
        )}

        {activeRoute === 'login' && (
          <LoginScreen
            onNavigate={(r) => setActiveRoute(r as any)}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {activeRoute === 'role-selection' && (
          <RoleSelectionScreen
            onNavigate={(r) => setActiveRoute(r as any)}
            selectedRole={selectedRole}
            onSelectRole={(role) => setSelectedRole(role)}
          />
        )}

        {activeRoute === 'signup-step-1' && (
          <SignupBasicScreen
            onNavigate={(r) => setActiveRoute(r as any)}
            selectedRole={selectedRole}
            initialData={basicData}
            onNext={(data) => {
              setBasicData(data);
              setActiveRoute('signup-step-2');
            }}
          />
        )}

        {activeRoute === 'signup-step-2' && (
          <SignupHostelScreen
            onNavigate={(r) => setActiveRoute(r as any)}
            selectedRole={selectedRole}
            basicData={basicData}
            onCompleteSignup={handleCompleteSignup}
          />
        )}

        {activeRoute === 'pending-approval' && (
          <PendingApprovalScreen
            onNavigate={(r) => setActiveRoute(r as any)}
            userRole={
              profile?.role ??
              (selectedRole === 'warden'
                ? 'Warden / Administrator'
                : selectedRole === 'maintenance'
                ? 'Maintenance Technician'
                : selectedRole === 'security'
                ? 'Security Personnel'
                : 'Hostel Staff')
            }
            userEmail={profile?.email ?? basicData.email ?? 'staff@college.edu'}
          />
        )}

        {activeRoute === 'resident-dashboard' && (
          <ResidentDashboard
            userName={`${basicData.firstName} ${basicData.lastName}`}
            roomNumber={hostelData.roomNumber}
            hostelBlock="Vaigai Block A"
            onLogout={handleLogout}
          />
        )}

        {activeRoute === 'warden-dashboard' && (
          <WardenDashboard
            userName="Dr. Priya Raman"
            onLogout={handleLogout}
          />
        )}

        {activeRoute === 'maintenance-dashboard' && (
          <MaintenanceDashboard
            userName="Manoj Kumar"
            onLogout={handleLogout}
          />
        )}

        {activeRoute === 'security-dashboard' && (
          <SecurityDashboard
            userName="Suresh Kumar"
            onLogout={handleLogout}
          />
        )}

        {activeRoute === 'superadmin-dashboard' && (
          <SuperAdminDashboard
            userName="Super Administrator"
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <SosProvider>
          <WorkPassProvider>
            <VisitorPassProvider>
              <CircleProvider>
                <AppContent />
              </CircleProvider>
            </VisitorPassProvider>
          </WorkPassProvider>
        </SosProvider>
      </ToastProvider>
    </AuthProvider>
  );
}