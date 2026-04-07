cd "c:/Users/Piyush Sharma/Documents/Hackathons/Skill Pulse/skillpulse/packages/dashboard/src"

mkdir "Skillpulse Admin" -ErrorAction SilentlyContinue
mkdir "skillpulse Employee" -ErrorAction SilentlyContinue
mkdir "shared" -ErrorAction SilentlyContinue

mv pages/LandingPage.tsx "Skillpulse Admin/LandingPage.tsx" -ErrorAction SilentlyContinue
mv pages/TeamOverview.tsx "Skillpulse Admin/TeamOverview.tsx" -ErrorAction SilentlyContinue
mv pages/EmployeeDetail.tsx "Skillpulse Admin/EmployeeDetail.tsx" -ErrorAction SilentlyContinue
mv components/Sidebar.tsx "Skillpulse Admin/Sidebar.tsx" -ErrorAction SilentlyContinue

mv pages/EmployeeLandingPage.tsx "skillpulse Employee/EmployeeLandingPage.tsx" -ErrorAction SilentlyContinue
mv pages/EmployeeDashboard.tsx "skillpulse Employee/EmployeeDashboard.tsx" -ErrorAction SilentlyContinue
mv components/EmployeeSidebar.tsx "skillpulse Employee/EmployeeSidebar.tsx" -ErrorAction SilentlyContinue

mv components/DashboardLayout.tsx "shared/DashboardLayout.tsx" -ErrorAction SilentlyContinue
mv components/SkillScoreBadge.tsx "shared/SkillScoreBadge.tsx" -ErrorAction SilentlyContinue
mv components/GapBadge.tsx "shared/GapBadge.tsx" -ErrorAction SilentlyContinue
mv components/SkillBadge.tsx "shared/SkillBadge.tsx" -ErrorAction SilentlyContinue

# The folder removals will fail if other files exist, but that's fine
Remove-Item pages -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item components -Recurse -Force -ErrorAction SilentlyContinue
