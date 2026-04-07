const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'packages', 'dashboard', 'src');

// Create directories
const dirs = [
  'modules/manager/pages',
  'modules/manager/components',
  'modules/employee/pages',
  'modules/employee/components',
  'shared/components/layout',
  'shared/components/ui',
  'shared/context',
  'shared/auth'
];
dirs.forEach(d => fs.mkdirSync(path.join(srcDir, d), { recursive: true }));

// Moves
const moves = [
  ['Skillpulse Admin/LandingPage.tsx', 'modules/manager/pages/LandingPage.tsx'],
  ['Skillpulse Admin/TeamOverview.tsx', 'modules/manager/pages/TeamOverview.tsx'],
  ['Skillpulse Admin/EmployeeDetail.tsx', 'modules/manager/pages/EmployeeDetail.tsx'],
  ['Skillpulse Admin/Sidebar.tsx', 'modules/manager/components/Sidebar.tsx'],
  ['skillpulse Employee/EmployeeLandingPage.tsx', 'modules/employee/pages/EmployeeLandingPage.tsx'],
  ['skillpulse Employee/EmployeeDashboard.tsx', 'modules/employee/pages/EmployeeDashboard.tsx'],
  ['skillpulse Employee/EmployeeSidebar.tsx', 'modules/employee/components/EmployeeSidebar.tsx'],
  ['shared/DashboardLayout.tsx', 'shared/components/layout/DashboardLayout.tsx'],
  ['shared/SkillScoreBadge.tsx', 'shared/components/ui/SkillScoreBadge.tsx'],
  ['shared/GapBadge.tsx', 'shared/components/ui/GapBadge.tsx'],
  ['shared/SkillBadge.tsx', 'shared/components/ui/SkillBadge.tsx'],
  ['shared/SubScoreBar.tsx', 'shared/components/ui/SubScoreBar.tsx'],
  ['shared/ScoreHistoryChart.tsx', 'shared/components/ui/ScoreHistoryChart.tsx'],
  ['shared/LearningPathCard.tsx', 'shared/components/ui/LearningPathCard.tsx']
];

moves.forEach(([from, to]) => {
  const source = path.join(srcDir, from);
  const dest = path.join(srcDir, to);
  if (fs.existsSync(source)) {
    fs.renameSync(source, dest);
  }
});

// Remove old folders
try { fs.rmSync(path.join(srcDir, 'Skillpulse Admin'), { recursive: true, force: true }); } catch(e){}
try { fs.rmSync(path.join(srcDir, 'skillpulse Employee'), { recursive: true, force: true }); } catch(e){}

// File Modifications mapping exact path overrides
const replaceInFile = (file, replacements) => {
   const fPath = path.join(srcDir, file);
   if (!fs.existsSync(fPath)) return;
   let content = fs.readFileSync(fPath, 'utf8');
   replacements.forEach(([find, rep]) => {
     content = content.replace(new RegExp(find, 'g'), rep);
   });
   fs.writeFileSync(fPath, content);
};

replaceInFile('App.tsx', [
   ['\\./Skillpulse Admin/', './modules/manager/pages/'],
   ['\\./skillpulse Employee/', './modules/employee/pages/'],
   ['\\./shared/DashboardLayout', './shared/components/layout/DashboardLayout']
]);

// Update Dashboard Layout
replaceInFile('shared/components/layout/DashboardLayout.tsx', [
   ['\\.\\./Skillpulse Admin/Sidebar', '../../../modules/manager/components/Sidebar'],
   ['\\.\\./skillpulse Employee/EmployeeSidebar', '../../../modules/employee/components/EmployeeSidebar']
]);

// Update Admin Routes
replaceInFile('modules/manager/pages/TeamOverview.tsx', [
   ['\\.\\./shared/', '../../../shared/components/ui/'],
   ['\\.\\./api/client', '../../../api/client']
]);

replaceInFile('modules/manager/pages/EmployeeDetail.tsx', [
   ['\\.\\./shared/', '../../../shared/components/ui/'],
   ['\\.\\./api/client', '../../../api/client']
]);

console.log('Restructure routing complete.');
