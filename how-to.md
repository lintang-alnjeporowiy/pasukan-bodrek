# HOW TO START THE PROJECT ON NIXOS
## Human Setup Guide

---

# 1. Purpose

Dokumen ini adalah panduan untuk:

```text
MANUSIA / PROJECT OWNER
```

dalam memulai development project:

```text
Maritime Transportation
and
Port Planning Application
```

Dokumen ini menjelaskan:

```text
Apa yang perlu disiapkan

Bagaimana membuat repository

Bagaimana menyiapkan environment di NixOS

Bagaimana mulai bekerja dengan coding agent

Bagaimana menjalankan dan memeriksa hasil development
```

Dokumen ini bukan:

```text
Application Specification
```

dan bukan:

```text
Instruction for Coding Agent
```

Instruksi implementasi utama berada di:

```text
docs/project.md
```

---

# 2. Development Environment

Development dilakukan pada:

```text
Operating System:
NixOS

Development Method:
Local Development

Container:
Not Required

Docker:
Not Used
```

Target development workflow:

```text
Open Terminal
        ↓
Enter Project Directory
        ↓
Enter Nix Development Shell
        ↓
Start Database
        ↓
Start Backend
        ↓
Start Frontend
        ↓
Open Browser
```

---

# 3. Software Strategy

Gunakan:

```text
Nix
```

untuk menyediakan development tools.

Jangan menginstal semua dependency project secara global ke sistem NixOS.

Preferred:

```text
Project Directory
        ↓
flake.nix
        ↓
nix develop
        ↓
Project Development Environment
```

Keuntungan:

```text
Development dependency terisolasi

Environment dapat direproduksi

Tidak perlu sering mengubah configuration.nix

Coding agent dapat mengetahui tool yang tersedia
```

---

# 4. Recommended Technology Stack

Ikuti stack final yang ditentukan dalam:

```text
docs/05_apps-and-database-architecture.md
```

Secara umum project membutuhkan:

```text
Backend Runtime
Frontend Runtime
PostgreSQL
Database Client
Git
```

Contoh development tools yang kemungkinan diperlukan:

```text
Python
Node.js
PostgreSQL
Git
```

Dependency aplikasi seperti:

```text
Python packages
JavaScript packages
```

dikelola oleh package manager masing-masing project.

Nix menyediakan:

```text
runtime
compiler
system dependency
development tools
```

---

# 5. Create the Project Directory

Pilih lokasi kerja.

Contoh:

```bash
mkdir -p ~/Projects
cd ~/Projects
mkdir maritime-transport-planner
cd maritime-transport-planner
```

Nama directory dapat disesuaikan.

Contoh lain:

```text
transport-planner
maritime-planner
tpt-webapp
```

Gunakan nama yang konsisten setelah project dimulai.

---

# 6. Initialize Git Repository

Di dalam project directory:

```bash
git init
```

Periksa:

```bash
git status
```

Expected:

```text
On branch main
```

Jika default branch bukan `main`:

```bash
git branch -M main
```

---

# 7. Create Initial Directory Structure

Pada tahap awal, cukup:

```text
project-root/
├── docs/
└── .git/
```

Jangan membuat:

```text
backend/
frontend/
database/
scripts/
```

secara manual jika coding agent akan membuatnya berdasarkan:

```text
docs/project.md
```

Tujuannya:

```text
Documentation First
        ↓
Implementation Second
```

---

# 8. Copy Documentation

Masukkan seluruh dokumen project ke:

```text
docs/
```

Expected structure:

```text
docs/
├── references/
├── 02_Tracebility-Matrix.md
├── 03_Domain-Model.md
├── 04_Optimization-Model.md
├── 05_apps-and-database-architecture.md
├── 06_project-vision.md
├── 07_initial-data.md
├── 08_test-case.md
├── 09_calculation-spec.md
├── 10_business-rules.md
├── 11_ui-ux.md
├── project.md
└── how-to.md
```

Original reference files remain inside:

```text
docs/references/
```

Example:

```text
docs/references/
├── KELOMPOK 21_..._Laporan.pdf
├── KELOMPOK 21_..._Perhitungan.xlsx
└── KELOMPOK 21_..._PPT.pptx
```

Do not:

```text
rename spreadsheet sheets

modify reference Excel

modify reference PDF

modify reference PPT
```

These files serve as:

```text
Original Reference Material
```

---

# 9. Verify Documentation

Run:

```bash
find docs -maxdepth 2 -type f | sort
```

Check that:

```text
all specification files exist

reference files exist

project.md exists
```

Do this before asking the coding agent to begin implementation.

---

# 10. Create Initial Git Commit

Before generating application code:

```bash
git add docs
git commit -m "docs: add project specifications and reference model"
```

This creates a clean checkpoint.

If something goes wrong later:

```text
the original documentation state
remains preserved in Git.
```

---

# 11. Check Nix Flakes

Check whether flakes work:

```bash
nix --version
```

Then:

```bash
nix flake --help
```

If the command works:

```text
Flakes are available.
```

If flakes are not enabled, configure NixOS to support:

```text
nix-command
flakes
```

A common NixOS configuration is:

```nix
nix.settings.experimental-features = [
  "nix-command"
  "flakes"
];
```

Then apply the system configuration using your normal NixOS rebuild workflow.

---

# 12. Do Not Install Project Dependencies Globally Yet

At this stage, avoid manually installing:

```text
Python packages

Node packages

Database migration tools

Backend framework

Frontend framework

Optimization libraries
```

globally.

Let the project define them through:

```text
flake.nix

Python dependency configuration

Frontend package configuration
```

This prevents:

```text
system dependency
and
project dependency
```

from becoming mixed.

---

# 13. PostgreSQL Development Strategy

The project requires a relational database.

Recommended:

```text
PostgreSQL
```

For local development, there are two reasonable approaches:

```text
OPTION A

PostgreSQL installed as a NixOS system service
```

or:

```text
OPTION B

PostgreSQL provided inside the project development environment
and run as a local development instance
```

For this project, recommended initial approach:

```text
OPTION B
```

because:

```text
the database remains project-local

less system configuration is required

the project is easier to reproduce
```

Do not manually configure the database before:

```text
Phase 1
Database Foundation
```

unless the coding agent explicitly reaches that step.

---

# 14. Recommended Local Database Location

When the database phase begins, keep development database data outside source-controlled files.

Conceptually:

```text
project-root/
├── .local/
│   └── postgres/
├── backend/
├── frontend/
└── docs/
```

Add local runtime data to:

```text
.gitignore
```

Example:

```gitignore
.local/
```

Never commit:

```text
PostgreSQL data directory

database password

application secrets
```

---

# 15. Environment Variables

Application configuration will likely require:

```text
DATABASE_URL
```

and possibly:

```text
BACKEND_HOST
BACKEND_PORT
FRONTEND_URL
```

Development secrets should be stored in:

```text
.env
```

or another local environment mechanism defined by the project architecture.

Never commit:

```text
.env
```

Add:

```gitignore
.env
.env.*
!.env.example
```

The repository may contain:

```text
.env.example
```

with example values but no real secrets.

---

# 16. Prepare the Coding Environment

Recommended editor:

```text
VS Code
```

or any editor with:

```text
terminal access

Git integration

Python support

frontend language support
```

Open the project root:

```bash
cd ~/Projects/maritime-transport-planner
code .
```

The coding agent should operate from:

```text
PROJECT ROOT
```

not from:

```text
docs/
```

---

# 17. First Instruction to the Coding Agent

Do not ask:

```text
Build this entire project.
```

Start with:

```text
Read docs/project.md.

Execute only Phase 0, Step 0.1:
Inspect Repository.

Do not modify any files.

Report the current repository structure,
relevant documentation,
and any issues that should be resolved
before Step 0.2.

Stop after completing Step 0.1.
```

Expected result:

```text
Repository inspected

No application code created yet

Coding agent understands project structure
```

---

# 18. Second Instruction to the Coding Agent

After reviewing Step 0.1:

```text
Continue with docs/project.md.

Execute only Phase 0, Step 0.2:
Create Application Skeleton.

Read only the documentation required
for this step.

Do not begin Step 0.3.

Run any relevant verification,
report what changed,
then stop.
```

Review the result.

Then commit:

```bash
git add .
git commit -m "chore: create initial application structure"
```

---

# 19. Third Instruction to the Coding Agent

Next:

```text
Continue with docs/project.md.

Execute only Phase 0, Step 0.3:
Create the Nix Development Environment.

The development machine runs NixOS.

Do not use Docker.

Create the minimum reproducible development
environment required by the selected architecture.

Verify that the development shell works.

Do not begin the backend implementation.

Stop after Step 0.3.
```

The coding agent should create the relevant:

```text
flake.nix
```

and, if needed:

```text
flake.lock
```

---

# 20. Enter the Development Environment

After `flake.nix` exists:

```bash
nix develop
```

The shell should provide the required development tools.

Check them.

Examples:

```bash
python --version
node --version
npm --version
psql --version
git --version
```

Only check tools actually selected by the architecture.

---

# 21. Optional direnv Setup

If you use:

```text
direnv
```

you may create:

```text
.envrc
```

containing:

```bash
use flake
```

Then:

```bash
direnv allow
```

After that, entering the project directory can automatically activate the development environment.

This is optional.

The basic workflow remains:

```bash
nix develop
```

---

# 22. Start Backend Development

Follow:

```text
docs/project.md
Phase 0
Step 0.4
```

Prompt:

```text
Continue with docs/project.md.

Execute only Phase 0, Step 0.4:
Backend Hello World.

Implement the minimum runnable backend.

Required endpoint:

GET /health

Expected response:

{
  "status": "ok"
}

Run the backend and verify the endpoint.

Do not begin frontend work.

Stop after verification.
```

---

# 23. Verify the Backend Yourself

Do not rely only on:

```text
"The agent says it works."
```

Run the application yourself.

The exact command depends on the generated project configuration.

Then test:

```bash
curl http://localhost:<backend-port>/health
```

Expected:

```json
{
  "status": "ok"
}
```

If it works:

```bash
git add .
git commit -m "feat: add backend health endpoint"
```

---

# 24. Start Frontend Development

Next prompt:

```text
Continue with docs/project.md.

Execute only Phase 0, Step 0.5:
Frontend Hello World.

Create the minimum frontend required
by the architecture.

Display:

Maritime Transportation Planner

and show whether the backend health endpoint
can be reached.

Verify the frontend.

Do not begin database implementation.

Stop after Step 0.5.
```

---

# 25. Verify the Frontend Yourself

Run:

```text
Backend Terminal
+
Frontend Terminal
```

Typical workflow:

```text
Terminal 1

nix develop
→ start backend
```

```text
Terminal 2

nix develop
→ start frontend
```

Open:

```text
localhost address shown by the frontend
```

Expected:

```text
Maritime Transportation Planner

API Connected
```

Then commit.

---

# 26. Recommended Terminal Workflow

During development, use separate terminals.

```text
TERMINAL 1
Backend

TERMINAL 2
Frontend

TERMINAL 3
Database

TERMINAL 4
Commands / Tests / Git
```

Not all terminals are required from the beginning.

Before database implementation:

```text
Database terminal
is unnecessary.
```

---

# 27. Database Setup Timing

Do not set up the database before reaching:

```text
Phase 1
Step 1.1
```

When that phase begins, instruct the coding agent:

```text
Continue with docs/project.md.

Execute only Phase 1, Step 1.1:
Database Connection.

Read:
- docs/03_Domain-Model.md
- docs/05_apps-and-database-architecture.md

Set up the local PostgreSQL development workflow
for NixOS without Docker.

Do not create the full application schema.

Implement and verify database connectivity only.

Stop after Step 1.1.
```

---

# 28. Database Initialization

The exact commands should be documented by the implementation when the database setup is created.

Conceptually, the first initialization will resemble:

```text
Create Local PostgreSQL Data Directory
        ↓
Initialize Database Cluster
        ↓
Start PostgreSQL
        ↓
Create Development Database
        ↓
Configure DATABASE_URL
        ↓
Verify Connection
```

Do not improvise different database workflows after the project already defines one.

Once implemented:

```text
follow the repository's own development commands.
```

---

# 29. Prefer Project Commands

As development grows, avoid remembering long commands.

The project should eventually provide simple commands such as:

```text
start database

start backend

start frontend

run tests

run migrations
```

These may be implemented through:

```text
scripts

task runner

package scripts

or another simple project mechanism
```

Use the mechanism selected by the project.

Do not create several competing command systems.

---

# 30. Daily Development Workflow

Recommended daily workflow:

```bash
cd ~/Projects/maritime-transport-planner
```

Then:

```bash
git status
```

Then:

```bash
nix develop
```

Start the required services.

Before asking the coding agent to modify code:

```bash
git status
```

should ideally be:

```text
clean
```

---

# 31. Working with the Coding Agent

For every task, provide:

```text
1. Exact project step

2. Relevant documentation

3. Explicit stopping point
```

Good prompt:

```text
Continue with docs/project.md.

Implement only Phase 3, Step 3.4:
Demand Projection.

Read:
- docs/09_calculation-spec.md
- docs/08_test-case.md

Implement the calculation as a pure function.

Add tests using the reference case.

Do not implement outbound cargo conversion.

Run the tests and stop.
```

Bad prompt:

```text
Continue the project.
```

The second prompt gives the agent too much freedom.

---

# 32. Keep Tasks Small

Recommended task size:

```text
One entity

One calculation

One API workflow

One UI page

One integration
```

Avoid combining:

```text
Database
+
All Models
+
Calculation Engine
+
Frontend
+
Optimization
```

in one request.

---

# 33. Review Every Step

After each coding-agent task:

```text
1. Read the summary.

2. Check git diff.

3. Run the relevant command.

4. Open the application if applicable.

5. Run tests.

6. Commit only if satisfied.
```

Useful command:

```bash
git diff
```

Also:

```bash
git status
```

---

# 34. Commit Frequently

Commit after a small verified milestone.

Examples:

```bash
git commit -m "chore: initialize project structure"
```

```bash
git commit -m "chore: add nix development environment"
```

```bash
git commit -m "feat: add project management"
```

```bash
git commit -m "feat: add demand projection"
```

```bash
git commit -m "test: verify reference sea time calculation"
```

Avoid waiting until:

```text
20 unrelated features
```

are mixed into one commit.

---

# 35. If Something Breaks

First:

```bash
git status
```

Then:

```bash
git diff
```

Do not immediately ask the coding agent to:

```text
rewrite everything
```

Instead describe:

```text
What command was run

What was expected

What actually happened

Full error message
```

Example:

```text
I am at Phase 0 Step 0.4.

When I run:

<command>

I receive:

<full error>

Fix only this issue.

Do not continue to the next project step.
```

---

# 36. Do Not Hide Errors

Do not accept solutions that:

```text
disable tests

remove validation

replace missing values with zero

hardcode expected final results

skip database migrations

silently choose default decisions
```

The project depends on:

```text
correctness
+
traceability
```

not merely:

```text
making the error disappear.
```

---

# 37. Reference Files

The coding agent should normally use:

```text
docs/*.md
```

The original:

```text
Excel
PDF
PPT
```

inside:

```text
docs/references/
```

should only be used when:

```text
a specification is ambiguous

a test fails unexpectedly

a reference formula must be confirmed
```

Do not repeatedly ask the coding agent to reverse engineer the Excel from scratch.

That work has already been translated into:

```text
Traceability Matrix
Domain Model
Calculation Specification
Business Rules
Initial Data
Test Cases
```

---

# 38. When Calculation Development Begins

Always require:

```text
automated test
```

for important formulas.

Example workflow:

```text
Implement Sea Time
        ↓
Run Unit Test
        ↓
Compare Reference Value
        ↓
PASS
        ↓
Commit
```

Do not build ten dependent formulas before testing the first one.

---

# 39. When the UI Begins Growing

Always verify:

```text
the UI uses real backend data
```

Prefer:

```text
Database
→
Backend
→
Frontend
```

Avoid spending large amounts of time on:

```text
static mock UI
```

that is disconnected from application behavior.

---

# 40. When Optimization Development Begins

Do not start optimization until:

```text
K21 reference deterministic calculation
```

has passed.

Required milestone:

```text
MILESTONE F
```

from:

```text
docs/project.md
```

The correct sequence is:

```text
Calculation Engine Works
        ↓
Reference Result Verified
        ↓
Optimization Added
```

Not:

```text
Optimizer
        ↓
Unverified Calculation
```

---

# 41. Recommended Progress Tracking

Use:

```text
docs/project.md
```

as the roadmap.

Optionally maintain a small local progress file:

```text
PROGRESS.md
```

Example:

```markdown
# Current Progress

Current Phase:
Phase 3

Current Step:
Step 3.4 — Demand Projection

Completed:
- Phase 0
- Phase 1
- Phase 2
- Phase 3.1
- Phase 3.2
- Phase 3.3

Next:
- Phase 3.4

Known Issues:
- None
```

This file is useful when:

```text
changing coding sessions

changing AI context

returning to the project later
```

---

# 42. Recommended Use of Git Branches

For initial solo development:

```text
main
```

plus short-lived feature branches is sufficient.

Example:

```bash
git switch -c feat/demand-projection
```

After verification:

```bash
git switch main
git merge feat/demand-projection
```

However, do not introduce complex Git workflows unnecessarily.

For early development, frequent clean commits are more important.

---

# 43. Backup Strategy

The project should exist in:

```text
Local Git Repository
```

and preferably:

```text
Remote Private Repository
```

Do not rely on:

```text
one local directory
```

as the only copy.

Before pushing:

```text
verify that secrets
and
local database files
```

are ignored.

---

# 44. Files That Must Not Be Committed

At minimum:

```text
.env

local database data

runtime logs

temporary files

dependency build outputs

editor-specific temporary files
```

The project `.gitignore` should be reviewed as the stack becomes concrete.

---

# 45. What You Need to Understand as Project Owner

You do not need to manually implement every formula.

You should understand:

```text
What phase is being implemented

What data enters the feature

What result should appear

How the result is verified

Whether the coding agent stayed within scope
```

For calculation work, always ask:

```text
What input was used?

What expected value was tested?

Did the reference test pass?
```

---

# 46. Human Checkpoint Before Moving Forward

Before continuing to the next phase, ask:

```text
Can I run it?

Can I see the result?

Does the test pass?

Do I understand what changed?

Is Git clean after commit?
```

If:

```text
NO
```

resolve the current step first.

---

# 47. Initial Setup Checklist

Before beginning coding:

```text
[ ] Project directory created

[ ] Git repository initialized

[ ] docs/ copied

[ ] references/ copied

[ ] project.md available

[ ] how-to.md available

[ ] Initial documentation committed

[ ] Nix flakes available

[ ] Editor opens project root

[ ] Git working tree clean
```

Then begin:

```text
Phase 0
Step 0.1
```

---

# 48. First Target

Do not think initially about:

```text
complete optimization

complete database

complete UI

production deployment
```

The first target is only:

```text
Open Application
        ↓
Backend Responds
        ↓
Frontend Opens
```

Then:

```text
Create Project
```

Then:

```text
Create Tenant
```

Then:

```text
Project Demand
```

Then:

```text
Calculate One Cargo Flow
```

Progress should remain:

```text
small
visible
verifiable
```

---

# 49. Recommended Starting Sequence

Execute in this order:

```text
1. Create project directory

2. Copy docs and references

3. Initialize Git

4. Commit documentation

5. Ask coding agent to execute:
   Phase 0 Step 0.1

6. Review

7. Execute:
   Phase 0 Step 0.2

8. Review and commit

9. Execute:
   Phase 0 Step 0.3

10. Run:
    nix develop

11. Execute:
    Phase 0 Step 0.4

12. Test backend yourself

13. Commit

14. Execute:
    Phase 0 Step 0.5

15. Open application in browser

16. Commit
```

At that point the project has moved from:

```text
Documentation
```

to:

```text
A Running Web Application Skeleton
```

---

# 50. Final Working Principle

Your role:

```text
Choose the next small objective

Give the coding agent clear scope

Run the result

Verify the result

Commit the result
```

The coding agent's role:

```text
Read relevant specifications

Implement the requested step

Test it

Report the result

Stop
```

The development cycle is:

```text
SPECIFICATION
        ↓
SMALL TASK
        ↓
IMPLEMENTATION
        ↓
TEST
        ↓
HUMAN VERIFICATION
        ↓
GIT COMMIT
        ↓
NEXT TASK
```

Do not rush toward:

```text
"finished application"
```

Build toward:

```text
the next working milestone.
```