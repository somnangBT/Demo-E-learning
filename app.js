(() => {
    const root = document.getElementById("portal-root");
    const menus = {
        Teacher: [
            ["Main menu", [["Dashboard", "◫"], ["Courses", "▣"], ["Lessons", "▤"], ["Students", "♧"], ["Student details", "♙"]]],
            ["Teaching", [["Assignments", "☑"], ["Assignment submissions", "⇧"], ["Grading", "✎"], ["Quizzes", "◷"], ["Quiz builder", "＋"], ["Calendar", "▦"]]],
            ["Communication", [["Messages", "✉"], ["Notifications", "♢"]]],
            ["Account", [["Reports", "▥"], ["Settings", "⚙"], ["Profile", "♙"]]]
        ],
        Student: [
            ["Main menu", [["Dashboard", "◫"], ["My Courses", "▣"], ["Course details", "▤"], ["Lessons", "▤"], ["Learning materials", "▧"]]],
            ["Learning", [["Assignments", "☑"], ["Submit assignment", "⇧"], ["Quizzes", "◷"], ["Take quiz", "▶"], ["Quiz results", "✓"], ["Calendar", "▦"], ["Progress", "↗"], ["Certificates", "♜"]]],
            ["Communication", [["Messages", "✉"], ["Notifications", "♢"]]],
            ["Account", [["Profile", "♙"]]]
        ]
    };
    const icons = { Courses: "▣", Lessons: "▤", Assignments: "☑", Quizzes: "◷", Students: "♧", Calendar: "▦", Messages: "✉", Notifications: "♢" };
    const initialCourses = [
        { id: 1, title: "Advanced Web Design", category: "Frontend Development", description: "Create polished, accessible interfaces with modern HTML, CSS, and JavaScript.", lessons: 18, progress: 65 },
        { id: 2, title: "Java Programming 101", category: "Computer Science", description: "Build a strong foundation in Java, object-oriented programming, and problem solving.", lessons: 24, progress: 42 },
        { id: 3, title: "Introduction to Databases", category: "Data & Technology", description: "Learn relational data, SQL queries, and practical database design.", lessons: 12, progress: 100 },
        { id: 4, title: "Learning Skills", category: "Personal Development", description: "Build productive study routines and strategies for lifelong learning.", lessons: 10, progress: 28 }
    ];
    const initialAssignments = [
        { id: 1, title: "Build a responsive landing page", course: "Advanced Web Design", due: "2026-10-15", status: "Pending" },
        { id: 2, title: "Array sorting exercise", course: "Java Programming 101", due: "2026-10-18", status: "In progress" },
        { id: 3, title: "Database design worksheet", course: "Introduction to Databases", due: "2026-10-22", status: "Submitted" }
    ];
    const initialStudents = [
        { name: "Alex Johnson", email: "alex.johnson@example.com", course: "Advanced Web Design", progress: 72, status: "Active", assignments: 5, average: 92 },
        { name: "Sam Rivera", email: "sam.rivera@example.com", course: "Java Programming 101", progress: 54, status: "Active", assignments: 3, average: 84 },
        { name: "Taylor Morgan", email: "taylor.morgan@example.com", course: "Introduction to Databases", progress: 91, status: "Active", assignments: 7, average: 95 },
        { name: "Jamie Chen", email: "jamie.chen@example.com", course: "Advanced Web Design", progress: 38, status: "Needs support", assignments: 2, average: 68 }
    ];
    const seed = (key, value) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : value;
        } catch (error) {
            console.error(`Unable to load ${key} from local storage.`, error);
            return value;
        }
    };
    const state = {
        role: "",
        name: "",
        page: "Dashboard",
        selectedCourseId: null,
        courses: seed("eteaching-courses", initialCourses),
        completedLessons: seed("eteaching-completed-lessons", []),
        lessons: seed("eteaching-lessons", [
            { id: 1, title: "Getting started with HTML", course: "Advanced Web Design", type: "Video", description: "A friendly introduction to page structure and semantic HTML." },
            { id: 2, title: "CSS Grid Mastery", course: "Advanced Web Design", type: "Lesson", description: "Build responsive layouts with CSS Grid." },
            { id: 3, title: "Objects and classes", course: "Java Programming 101", type: "Lesson", description: "Understand classes, objects, and methods in Java." }
        ]),
        assignments: seed("eteaching-assignments", initialAssignments),
        quizzes: seed("eteaching-quizzes", [
            { id: 1, title: "HTML & CSS Fundamentals", course: "Advanced Web Design", questions: 10, status: "Available" },
            { id: 2, title: "Java Basics Check-in", course: "Java Programming 101", questions: 8, status: "Available" }
        ]),
        quizResults: seed("eteaching-quiz-results", []),
        materials: seed("eteaching-materials", [
            { id: 1, title: "HTML semantic elements guide", course: "Advanced Web Design", type: "Reading", description: "A quick reference for landmarks, headings, forms, and accessible page structure." },
            { id: 2, title: "CSS Grid practice sheet", course: "Advanced Web Design", type: "Worksheet", description: "Practice creating responsive page layouts with grid columns and gaps." },
            { id: 3, title: "Java methods reference", course: "Java Programming 101", type: "Reference", description: "Examples of method declarations, parameters, and return values." },
            { id: 4, title: "Database design checklist", course: "Introduction to Databases", type: "Checklist", description: "A step-by-step checklist for planning tables and relationships." }
        ]),
        events: seed("eteaching-events", [
            { id: 1, title: "Midterm Quiz: Web Design", date: "2026-10-15", details: "10:00 AM · Online" },
            { id: 2, title: "Live Q&A: Java Loops", date: "2026-10-20", details: "2:00 PM · Zoom" },
            { id: 3, title: "Database assignment due", date: "2026-10-22", details: "11:59 PM · Online" }
        ]),
        messages: seed("eteaching-messages", [
            { id: 1, to: "Course discussion", message: "Jordan Lee: The new lesson notes are really helpful. Thank you!" },
            { id: 2, to: "Web Design group", message: "3 new replies about the upcoming project." },
            { id: 3, to: "Teaching team", message: "Planning meeting moved to Friday at 2:00 PM." }
        ]),
        notifications: seed("eteaching-notifications", [
            { id: 1, title: "New lesson available", message: "A new learning module has been added to Advanced Web Design.", read: false },
            { id: 2, title: "Assignment reminder", message: "Your next assignment deadline is coming up on October 15.", read: false },
            { id: 3, title: "Progress milestone", message: "You've completed another step in your learning journey!", read: true }
        ]),
        modal: null
    };

    const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
    const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    const initials = (name) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
    const isTeacher = () => state.role === "Teacher";

    function renderLogin() {
        root.innerHTML = `
            <section class="portal-login">
                <div class="login-art">
                    <div class="login-brand"><div class="brand-mark">ET</div><div><strong>E-Teaching</strong><span>Learning, made personal</span></div></div>
                    <div class="login-copy"><h1>Make every lesson count.</h1><p>A welcoming space to teach, learn, and grow together. Pick up where you left off and make progress at your own pace.</p></div>
                    <div class="login-art-foot">A simple learning portal demo &middot; Your next chapter starts here</div>
                </div>
                <div class="login-side"><form class="login-form" id="login-form">
                    <p class="portal-eyebrow">E-Teaching portal</p><h2>Welcome back</h2>
                    <p class="login-subtitle">Choose your account type and sign in to continue.</p>
                    <span class="portal-label">I am signing in as</span>
                    <div class="role-picker">
                        <button class="role-option selected" type="button" data-role="Student"><span>🎓</span><strong>Student</strong><br><small>Learn and track progress</small></button>
                        <button class="role-option" type="button" data-role="Teacher"><span>🧑‍🏫</span><strong>Teacher</strong><br><small>Teach and manage courses</small></button>
                    </div>
                    <label class="portal-label" for="login-name">Your name</label>
                    <input class="portal-input" id="login-name" name="name" autocomplete="name" placeholder="e.g. Alex Johnson" required>
                    <label class="portal-label" for="login-password">Password</label>
                    <input class="portal-input" id="login-password" name="password" type="password" autocomplete="current-password" placeholder="Enter your password" required>
                    <div class="portal-error" id="login-error" role="alert"></div>
                    <button class="portal-btn primary login-submit" type="submit">Sign in <span aria-hidden="true">→</span></button>
                    <div class="demo-note"><strong>Demo access:</strong> choose Teacher or Student and enter password <strong>123</strong>. Any name can be used. This front-end demo does not provide real account security.</div>
                </form></div>
            </section>`;
        root.querySelectorAll("[data-role]").forEach((button) => button.addEventListener("click", () => {
            root.querySelectorAll("[data-role]").forEach((option) => option.classList.toggle("selected", option === button));
        }));
        root.querySelector("#login-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const password = form.get("password");
            const name = String(form.get("name") || "").trim();
            if (password !== "123") {
                root.querySelector("#login-error").textContent = "That password doesn't match the demo account. Please try 123.";
                return;
            }
            state.role = root.querySelector("[data-role].selected").dataset.role;
            state.name = name;
            state.page = "Dashboard";
            renderPortal();
        });
    }

    function renderPortal() {
        const menu = menus[state.role];
        root.innerHTML = `
            <div class="portal-shell">
                <aside class="portal-sidebar" id="portal-sidebar">
                    <div class="portal-brand"><div class="brand-mark">ET</div><div><strong>E-Teaching</strong><span>${escapeHTML(state.role)} portal</span></div></div>
                    <nav class="portal-nav" aria-label="Main navigation">
                        ${menu.map(([group, links]) => `<div class="nav-group-label">${escapeHTML(group)}</div>${links.map(([label, icon]) => `
                            <button class="portal-nav-item ${state.page === label ? "active" : ""}" data-page="${escapeHTML(label)}">
                                <span class="nav-symbol">${icon}</span><span>${escapeHTML(label)}</span>
                            </button>`).join("")}`).join("")}
                    </nav>
                    <div class="portal-sidebar-foot"><div class="user-chip"><div class="user-avatar">${escapeHTML(initials(state.name))}</div><div><strong>${escapeHTML(state.name)}</strong><span>${escapeHTML(state.role)} account</span></div></div></div>
                </aside>
                <main class="portal-main">
                    <header class="portal-topbar">
                        <button class="portal-btn ghost mobile-nav-toggle" data-action="toggle-menu" aria-label="Toggle menu">☰</button>
                        <label class="portal-search"><span aria-hidden="true">⌕</span><input id="portal-search" type="search" placeholder="Search this page..." aria-label="Search this page"></label>
                        <div class="topbar-actions">
                            <button class="portal-btn ghost small" data-action="theme" title="Toggle dark mode" aria-label="Toggle dark mode">◐</button>
                            <button class="portal-btn ghost small" data-page="Notifications" aria-label="Notifications">♢</button>
                            <button class="portal-btn small topbar-user" data-page="Profile">${escapeHTML(state.name)} &middot; ${escapeHTML(state.role)}</button>
                            <button class="portal-btn small" data-action="logout">Sign out</button>
                        </div>
                    </header>
                    <section class="portal-content" id="portal-content">${renderPage()}</section>
                </main>
            </div>
            ${state.modal ? renderModal() : ""}`;
        root.querySelectorAll("[data-page]").forEach((button) => button.addEventListener("click", () => {
            state.page = button.dataset.page;
            renderPortal();
        }));
        root.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", onAction));
        const search = root.querySelector("#portal-search");
        search.addEventListener("input", () => {
            const query = search.value.trim().toLowerCase();
            root.querySelectorAll("[data-searchable]").forEach((item) => {
                item.hidden = query && !item.textContent.toLowerCase().includes(query);
            });
        });
        if (state.modal) {
            root.querySelectorAll("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
        }
    }

    function pageHeader(title, description, action = "") {
        return `<div class="portal-page-head"><div><p class="portal-eyebrow">${escapeHTML(state.role)} workspace</p><h1 class="portal-title">${escapeHTML(title)}</h1><p class="portal-description">${escapeHTML(description)}</p></div>${action ? `<div class="portal-page-actions">${action}</div>` : ""}</div>`;
    }
    function button(label, action, style = "") {
        return `<button class="portal-btn ${style}" data-action="${escapeHTML(action)}">${escapeHTML(label)}</button>`;
    }
    function stat(label, value, foot, icon) {
        return `<article class="portal-stat"><div class="stat-line"><span>${escapeHTML(label)}</span><span>${icon}</span></div><div class="stat-number">${escapeHTML(value)}</div><div class="stat-foot">${escapeHTML(foot)}</div></article>`;
    }
    function dashboard() {
        const title = `Good ${new Date().getHours() < 12 ? "morning" : "afternoon"}, ${state.name.split(" ")[0]}`;
        const mainAction = isTeacher() ? button("＋ Create course", "course-new", "primary") : button("Browse courses", "course-browse", "primary");
        const summary = isTeacher()
            ? [stat("Active courses", state.courses.length, "Courses in your workspace", "▣"), stat("Students", initialStudents.length, "Across all courses", "♧"), stat("To grade", state.assignments.filter((item) => item.status === "Submitted").length + 5, "Submissions awaiting review", "✎"), stat("Upcoming events", "3", "On your teaching calendar", "▦")]
            : [stat("Courses in progress", "4", "2 completed this semester", "▣"), stat("Pending assignments", state.assignments.filter((item) => item.status !== "Submitted").length, "One due soon — keep it up!", "☑"), stat("Average quiz score", "88%", "Up 4% from last month", "◷"), stat("Certificates earned", "3", "Celebrate your progress", "♜")];
        return `${pageHeader(title, isTeacher() ? "Here's what's happening in your teaching space today." : "A little progress each day adds up. Here's your learning at a glance.", mainAction)}
            <div class="portal-stats">${summary.join("")}</div>
            <div class="portal-grid">
                <section class="portal-panel"><div class="panel-head"><h3>${isTeacher() ? "Your courses" : "Pick up where you left off"}</h3><button class="portal-btn ghost small" data-page="${isTeacher() ? "Courses" : "My Courses"}">View all →</button></div><div class="panel-body"><div class="course-grid">${courseCards(state.courses.slice(0, 4))}</div></div></section>
                <div>
                    <section class="portal-panel"><div class="panel-head"><h3>${isTeacher() ? "Needs your attention" : "Coming up next"}</h3></div><div class="panel-body simple-list">
                        <div class="simple-row"><div class="row-icon">${isTeacher() ? "✎" : "☑"}</div><div class="row-copy"><strong>${isTeacher() ? "Assignment submissions" : "Build a responsive landing page"}</strong><span>${isTeacher() ? "5 submissions ready to review" : "Advanced Web Design · Due Oct 15"}</span></div></div>
                        <div class="simple-row"><div class="row-icon">◷</div><div class="row-copy"><strong>${isTeacher() ? "Web Design Q&A" : "Midterm Quiz: Web Design"}</strong><span>Oct 15 · 10:00 AM</span></div></div>
                        <div class="simple-row"><div class="row-icon">✉</div><div class="row-copy"><strong>New course message</strong><span>You have an update from your ${isTeacher() ? "students" : "teacher"}.</span></div></div>
                    </div></section>
                    <section class="portal-panel" style="margin-top:16px"><div class="panel-head"><h3>Quick access</h3></div><div class="panel-body" style="display:flex;flex-wrap:wrap;gap:8px">${button(isTeacher() ? "Review work" : "My assignments", isTeacher() ? "go-submissions" : "go-assignments", "small")}${button(isTeacher() ? "View students" : "Take a quiz", isTeacher() ? "go-students" : "go-quizzes", "small")}</div></section>
                </div>
            </div>`;
    }
    function courseCards(courses) {
        if (!courses.length) return `<div class="empty-state"><strong>No courses yet</strong>Create a course to get started.</div>`;
        return courses.map((course, index) => `<article class="course-tile" data-searchable>
            <div class="course-cover color-${index % 4}"><strong>${escapeHTML(course.category)}</strong></div>
            <div class="course-tile-body"><strong>${escapeHTML(course.title)}</strong><p>${escapeHTML(course.description)}</p>
            <div class="course-meta"><span>${escapeHTML(course.lessons)} lessons</span><span>${escapeHTML(course.progress || 0)}% complete</span></div>
            <div class="portal-progress"><span style="width:${Math.max(0, Math.min(100, Number(course.progress) || 0))}%"></span></div>
            <div class="course-meta">${isTeacher() ? `<span>Course management</span><span class="table-actions"><button class="portal-btn small" data-action="course-edit" data-id="${course.id}">Edit</button><button class="portal-btn small danger" data-action="course-delete" data-id="${course.id}">Delete</button></span>` : `<span>${escapeHTML(course.category)}</span><button class="portal-btn small" data-action="course-open" data-id="${course.id}">Details →</button>`}</div>
            </div></article>`).join("");
    }
    function table(headers, rows) {
        return `<div class="portal-table-wrap"><table class="portal-table"><thead><tr>${headers.map((header) => `<th>${escapeHTML(header)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.join("") : `<tr><td colspan="${headers.length}"><div class="empty-state"><strong>Nothing to show yet</strong>New items will appear here.</div></td></tr>`}</tbody></table></div>`;
    }
    function featureCards(items) {
        return `<div class="feature-grid">${items.map(([icon, title, description, action, label]) => `<article class="feature-card" data-searchable><span class="feature-icon">${icon}</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p>${action ? button(label || "Open", action, "small") : ""}</article>`).join("")}</div>`;
    }
    function renderPage() {
        const page = state.page;
        if (page === "Dashboard") return dashboard();
        if (page === "Course details" && !isTeacher()) {
            const course = state.courses.find((item) => item.id === state.selectedCourseId) || state.courses[0];
            if (!course) return `${pageHeader(page, "Your selected course details.")}<div class="empty-state"><strong>No course selected</strong>Enroll in a course to see its lessons and materials.</div>`;
            const lessons = state.lessons.filter((item) => item.course === course.title);
            const progress = Math.max(0, Math.min(100, Number(course.progress) || 0));
            return `${pageHeader(course.title, `${course.category} · ${course.lessons} lessons`, button("View all lessons", "course-lessons", "primary"))}<section class="portal-panel"><div class="panel-head"><h3>About this course</h3><span class="status-pill info">${progress}% complete</span></div><div class="panel-body"><p class="portal-description">${escapeHTML(course.description)}</p><div class="portal-progress" style="margin-top:14px"><span style="width:${progress}%"></span></div></div></section><section class="portal-panel" style="margin-top:16px"><div class="panel-head"><h3>Course lessons</h3><button class="portal-btn ghost small" data-page="Learning materials">Learning materials →</button></div><div class="panel-body simple-list">${lessons.length ? lessons.map((lesson) => `<div class="simple-row" data-searchable><div class="row-icon">${state.completedLessons.includes(lesson.id) ? "✓" : "▤"}</div><div class="row-copy"><strong>${escapeHTML(lesson.title)}</strong><span>${escapeHTML(lesson.type)} · ${state.completedLessons.includes(lesson.id) ? "Completed" : escapeHTML(lesson.description)}</span></div><button class="portal-btn small" data-action="lesson-open" data-id="${lesson.id}">${state.completedLessons.includes(lesson.id) ? "Review" : "Start lesson"}</button></div>`).join("") : `<div class="empty-state"><strong>Lessons are being prepared</strong>Check back soon for course lessons.</div>`}</div></section>`;
        }
        if (page === "Courses" || page === "My Courses" || page === "Course details") {
            const actions = isTeacher() ? button("＋ Create course", "course-new", "primary") : "";
            const desc = isTeacher() ? "Create, edit, and organize the learning experiences you teach." : "Explore your enrolled classes, course materials, and learning progress.";
            return `${pageHeader(page, desc, actions)}${page === "Course details" ? `<section class="portal-panel" style="margin-bottom:16px"><div class="panel-head"><h3>Your course overview</h3></div><div class="panel-body"><p class="portal-description">Select a course to view its lessons and learning materials.</p></div></section>` : ""}<div class="course-grid">${courseCards(state.courses)}</div>`;
        }
        if (page === "Lessons" && isTeacher()) {
            const lessonActions = button("＋ Create lesson", "lesson-new", "primary");
            const rows = state.lessons.map((lesson) => `<tr data-searchable><td>${escapeHTML(lesson.title)}</td><td>${escapeHTML(lesson.course)}</td><td><span class="status-pill info">${escapeHTML(lesson.type)}</span></td><td>${escapeHTML(lesson.description)}</td><td><span class="table-actions"><button class="portal-btn small" data-action="lesson-edit" data-id="${lesson.id}">Edit</button><button class="portal-btn small danger" data-action="lesson-delete" data-id="${lesson.id}">Delete</button></span></td></tr>`);
            return `${pageHeader(page, "Create and organize lessons and learning materials for your courses.", lessonActions)}<section class="portal-panel">${table(["Lesson", "Course", "Type", "Description", "Actions"], rows)}</section>`;
        }
        if (page === "Lessons" || page === "Learning materials") {
            const courseFilter = state.selectedCourseId ? state.courses.find((item) => item.id === state.selectedCourseId)?.title : "";
            if (page === "Lessons") {
                const lessons = state.lessons.filter((lesson) => !courseFilter || lesson.course === courseFilter);
                const rows = lessons.map((lesson) => {
                    const complete = state.completedLessons.includes(lesson.id);
                    return `<tr data-searchable><td>${escapeHTML(lesson.title)}</td><td>${escapeHTML(lesson.course)}</td><td>${escapeHTML(lesson.type)}</td><td><span class="status-pill ${complete ? "" : "pending"}">${complete ? "Completed" : "Not started"}</span></td><td><button class="portal-btn small" data-action="lesson-open" data-id="${lesson.id}">${complete ? "Review" : "Start lesson"}</button></td></tr>`;
                });
                return `${pageHeader(page, courseFilter ? `Lessons in ${courseFilter}.` : "Continue a lesson or review something you've already completed.", courseFilter ? button("All lessons", "all-lessons") : "")}<section class="portal-panel">${table(["Lesson", "Course", "Type", "Progress", "Action"], rows)}</section>`;
            }
            const materials = state.materials.filter((item) => !courseFilter || item.course === courseFilter);
            const rows = materials.map((material) => `<tr data-searchable><td>${escapeHTML(material.title)}</td><td>${escapeHTML(material.course)}</td><td><span class="status-pill info">${escapeHTML(material.type)}</span></td><td>${escapeHTML(material.description)}</td><td><button class="portal-btn small" data-action="materials-open" data-id="${material.id}">Open material</button></td></tr>`);
            return `${pageHeader(page, courseFilter ? `Study resources for ${courseFilter}.` : "Open study guides and resources for your enrolled courses.", courseFilter ? button("All materials", "all-materials") : "")}<section class="portal-panel">${table(["Resource", "Course", "Type", "About", "Action"], rows)}</section>`;
        }
        if (page === "Students") {
            return `${pageHeader(page, "A quick overview of learners enrolled in your courses.")}<div class="feature-grid">${initialStudents.map((student) => `<article class="feature-card" data-searchable><span class="feature-icon">♙</span><h3>${escapeHTML(student.name)}</h3><p>${escapeHTML(student.course)} · ${student.progress}% complete<br>${escapeHTML(student.status)}</p><button class="portal-btn small" data-action="student-view" data-name="${escapeHTML(student.name)}">View student details</button></article>`).join("")}</div>`;
        }
        if (page === "Student details") {
            const rows = initialStudents.map((student) => `<tr data-searchable><td>${escapeHTML(student.name)}</td><td>${escapeHTML(student.email)}</td><td>${escapeHTML(student.course)}</td><td>${student.progress}%</td><td><span class="status-pill ${student.status === "Needs support" ? "pending" : ""}">${escapeHTML(student.status)}</span></td><td><button class="portal-btn small" data-action="student-view" data-name="${escapeHTML(student.name)}">View details</button></td></tr>`);
            return `${pageHeader(page, "Review each learner's course progress, assessment performance, and status.")}<section class="portal-panel">${table(["Student", "Email", "Course", "Progress", "Status", "Action"], rows)}</section>`;
        }
        if (["Assignments", "Assignment submissions", "Submit assignment", "Grading"].includes(page)) {
            const addAction = isTeacher() && ["Assignments", "Grading"].includes(page) ? button("＋ Create assignment", "assignment-new", "primary") : "";
            const assignments = !isTeacher() && page === "Submit assignment" ? state.assignments.filter((item) => item.status !== "Submitted" && item.status !== "Graded") : state.assignments;
            const rows = assignments.map((item) => `<tr data-searchable><td>${escapeHTML(item.title)}</td><td>${escapeHTML(item.course)}</td><td>${escapeHTML(item.due)}</td><td><span class="status-pill ${item.status === "Pending" ? "pending" : item.status === "Submitted" ? "" : "info"}">${escapeHTML(item.status)}${item.score !== undefined ? ` · ${item.score}/100` : ""}</span></td><td>${isTeacher() ? `<button class="portal-btn small" data-action="grade-assignment" data-id="${item.id}">${item.status === "Submitted" || item.status === "Graded" ? "Grade" : "Review"}</button>` : item.status === "Submitted" || item.status === "Graded" ? `<button class="portal-btn small" data-action="submission-view" data-id="${item.id}">View submission</button>` : `<button class="portal-btn small" data-action="assignment-submit" data-id="${item.id}">Submit</button>`}</td></tr>`);
            const description = isTeacher() ? "Manage coursework, review submissions, and share feedback." : page === "Submit assignment" ? "Choose an open assignment, attach your work, and submit it for review." : "Keep track of due dates, submitted work, and teacher feedback.";
            return `${pageHeader(page, description, addAction)}<section class="portal-panel">${table(["Assignment", "Course", "Due date", "Status", "Action"], rows)}</section>`;
        }
        if (["Quizzes", "Quiz builder", "Take quiz", "Quiz results"].includes(page)) {
            const addAction = isTeacher() ? button("＋ Build a quiz", "quiz-new", "primary") : "";
            if (!isTeacher() && page === "Quiz results") {
                const rows = state.quizResults.map((result) => `<tr data-searchable><td>${escapeHTML(result.title)}</td><td>${escapeHTML(result.course)}</td><td>${result.score}%</td><td>${escapeHTML(result.date)}</td><td><span class="status-pill">${result.score >= 70 ? "Passed" : "Keep practicing"}</span></td></tr>`);
                return `${pageHeader(page, "Review your saved scores and see how you're progressing.")}<section class="portal-panel">${table(["Quiz", "Course", "Score", "Completed", "Result"], rows)}</section>`;
            }
            const rows = state.quizzes.map((quiz) => `<tr data-searchable><td>${escapeHTML(quiz.title)}</td><td>${escapeHTML(quiz.course)}</td><td>${escapeHTML(quiz.questions)} questions</td><td><span class="status-pill">${escapeHTML(quiz.status)}</span></td><td>${isTeacher() ? `<button class="portal-btn small" data-action="quiz-edit" data-id="${quiz.id}">Edit quiz</button>` : `<button class="portal-btn small" data-action="take-quiz" data-id="${quiz.id}">Take quiz</button>`}</td></tr>`);
            return `${pageHeader(page, isTeacher() ? "Build knowledge checks and see how your students are progressing." : "Practice what you've learned and check your understanding.", addAction)}<section class="portal-panel">${table(["Quiz", "Course", "Length", "Status", "Action"], rows)}</section>`;
        }
        if (page === "Calendar") {
            const monthEvents = state.events.filter((item) => item.date.startsWith("2026-10"));
            return `${pageHeader(page, "Keep your classes, deadlines, and live sessions in view.", isTeacher() ? button("＋ Add event", "event-new", "primary") : "")}<section class="portal-panel"><div class="panel-head"><h3>October 2026</h3><span class="portal-description">Your learning calendar</span></div><div class="calendar-grid">${Array.from({ length: 35 }, (_, i) => { const day = i - 3; const events = monthEvents.filter((item) => Number(item.date.slice(-2)) === day); return `<div class="calendar-day">${day > 0 && day <= 31 ? `<strong>${day}</strong>${events.map((item) => `<span class="calendar-event" title="${escapeHTML(item.details)}">${escapeHTML(item.title)}</span>`).join("")}` : ""}</div>`; }).join("")}</div></section><section class="portal-panel" style="margin-top:16px"><div class="panel-head"><h3>Upcoming events</h3></div><div class="panel-body simple-list">${monthEvents.length ? monthEvents.map((item) => `<div class="simple-row" data-searchable><div class="row-icon">▦</div><div class="row-copy"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.date)} · ${escapeHTML(item.details)}</span></div></div>`).join("") : `<div class="empty-state">No events scheduled for this month.</div>`}</div></section>`;
        }
        if (page === "Progress") {
            const completedCount = state.completedLessons.length;
            const progressCourses = state.courses.map((course) => `<div class="simple-row" data-searchable><div class="row-copy"><strong>${escapeHTML(course.title)}</strong><span>${course.progress}% complete</span><div class="portal-progress" style="margin-top:10px"><span style="width:${course.progress}%"></span></div></div><button class="portal-btn small" data-action="course-select" data-id="${course.id}">View course</button></div>`).join("");
            return `${pageHeader(page, "Every lesson completed is a step forward.")}<div class="portal-stats">${stat("Lessons completed", completedCount, "Lessons you've marked complete", "✓")}${stat("Learning streak", completedCount ? `${Math.min(completedCount + 2, 30)} days` : "0 days", "Keep the momentum going", "↗")}${stat("Study time", `${completedCount * 2} hrs`, "Estimated time in lessons", "◷")}${stat("Quiz attempts", state.quizResults.length, "Saved results", "♜")}</div><section class="portal-panel"><div class="panel-head"><h3>Course progress</h3></div><div class="panel-body">${progressCourses || `<div class="empty-state">No course progress to show yet.</div>`}</div></section>`;
        }
        if (page === "Certificates") return `${pageHeader(page, "A collection of the goals you've reached.")}<div class="feature-grid">${[["Database Foundations", "Completed · September 2026"], ["HTML Essentials", "Completed · August 2026"], ["Study Skills", "Completed · July 2026"]].map(([title, detail]) => `<article class="feature-card" data-searchable><span class="feature-icon">🎓</span><h3>${escapeHTML(title)}</h3><p>${escapeHTML(detail)}</p><button class="portal-btn small" data-action="certificate-view" data-title="${escapeHTML(title)}">View certificate</button></article>`).join("")}</div>`;
        if (page === "Reports") return `${pageHeader(page, "A snapshot of course engagement and learner outcomes.", button("Export report", "export-report", "primary"))}<div class="portal-stats">${stat("Course completion", "78%", "Across active courses", "✓")}${stat("Learner engagement", "86%", "Weekly active learners", "↗")}${stat("Assignments graded", "42", "This month", "✎")}${stat("Average score", "87%", "All assessments", "◷")}</div><section class="portal-panel"><div class="panel-head"><h3>Course performance</h3></div><div class="panel-body">${state.courses.map((course) => `<div class="simple-row" data-searchable"><div class="row-copy"><strong>${escapeHTML(course.title)}</strong><span>${course.progress}% average progress · ${course.lessons} lessons</span></div><span class="status-pill">${course.progress >= 65 ? "On track" : "In progress"}</span></div>`).join("")}</div></section>`;
        if (page === "Messages") {
            const items = state.messages.map((item) => ["✉", item.to, item.message, "message-new", "Reply"]);
            return `${pageHeader(page, "Stay connected with your learning community.", button("＋ New message", "message-new", "primary"))}${featureCards(items)}`;
        }
        if (page === "Notifications") {
            const unreadCount = state.notifications.filter((item) => !item.read).length;
            const clearAction = unreadCount ? button("Mark all as read", "notifications-read-all") : "";
            const items = state.notifications.map((item) => `<article class="feature-card ${item.read ? "notification-read" : ""}" data-searchable><span class="feature-icon">${item.read ? "✓" : "♢"}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.message)}</p>${item.read ? `<span class="status-pill">Read</span>` : `<button class="portal-btn small" data-action="notification-read" data-id="${item.id}">Mark as read</button>`}</article>`).join("");
            return `${pageHeader(page, `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`, clearAction)}<div class="feature-grid">${items || `<div class="empty-state"><strong>You're all caught up</strong>New updates will appear here.</div>`}</div>`;
        }
        if (page === "Settings") return `${pageHeader(page, "Choose the preferences that work best for you.")}<section class="portal-panel"><div class="panel-head"><h3>Preferences</h3></div><div class="panel-body"><div class="simple-row"><div class="row-copy"><strong>Appearance</strong><span>Switch between light and dark theme</span></div>${button("Toggle theme", "theme", "small")}</div><div class="simple-row"><div class="row-copy"><strong>Email notifications</strong><span>Receive course updates and reminders</span></div><span class="status-pill">Enabled</span></div><div class="simple-row"><div class="row-copy"><strong>Account role</strong><span>${escapeHTML(state.role)} demo account</span></div>${button("Sign out", "logout", "small")}</div></div></section>`;
        if (page === "Profile") return `${pageHeader(page, "Manage your learner profile and account details.")}<section class="portal-panel"><div class="panel-head"><h3>Personal information</h3>${button("Edit profile", "profile-edit", "small")}</div><div class="panel-body simple-list"><div class="simple-row"><div class="row-copy"><strong>Name</strong><span>${escapeHTML(state.name)}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Role</strong><span>${escapeHTML(state.role)}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Email</strong><span>${escapeHTML(state.name.toLowerCase().replace(/\s+/g, "."))}@example.com</span></div></div></div></section>`;
        return `${pageHeader(page, "Explore your E-Teaching workspace.")}${featureCards([])}`;
    }

    function renderModal() {
        const modal = state.modal;
        const course = modal.type === "course" && modal.id ? state.courses.find((item) => item.id === modal.id) : null;
        const fields = modal.type === "course" ? `
            ${field("Course name", "title", course?.title || "", "text", true)}
            ${field("Category", "category", course?.category || "", "text", true)}
            ${field("Short description", "description", course?.description || "", "textarea", true)}
            ${field("Number of lessons", "lessons", course?.lessons || "", "number", true)}` :
            modal.type === "assignment" ? `${field("Assignment title", "title", "", "text", true)}${selectField("Course", "course", state.courses.map((item) => item.title))}${field("Due date", "due", "", "date", true)}` :
            modal.type === "quiz" ? (() => { const quiz = modal.id ? state.quizzes.find((item) => item.id === modal.id) : null; return `${field("Quiz title", "title", quiz?.title || "", "text", true)}${selectField("Course", "course", state.courses.map((item) => item.title), quiz?.course)}${field("Number of questions", "questions", quiz?.questions || "10", "number", true)}`; })() :
            modal.type === "event" ? `${field("Event title", "title", "", "text", true)}${field("Date", "date", "", "date", true)}${field("Details", "details", "", "text")}` :
            modal.type === "lesson" ? (() => { const lesson = modal.id ? state.lessons.find((item) => item.id === modal.id) : null; return `${field("Lesson title", "title", lesson?.title || "", "text", true)}${selectField("Course", "course", state.courses.map((item) => item.title), lesson?.course)}${selectField("Content type", "type", ["Lesson", "Video", "Reading", "Activity"], lesson?.type)}${field("Description", "description", lesson?.description || "", "textarea", true)}`; })() :
            modal.type === "profile" ? `${field("Your name", "name", state.name, "text", true)}` :
            modal.type === "submit" ? `${field("Submission notes", "notes", "", "textarea", true)}<label class="portal-label" for="submission-file">Attach a file (optional)</label><input class="portal-input" id="submission-file" name="file" type="file">` :
            modal.type === "submission-view" ? (() => { const assignment = state.assignments.find((item) => item.id === modal.id); return assignment ? `<div class="simple-list"><div class="simple-row"><div class="row-copy"><strong>Assignment</strong><span>${escapeHTML(assignment.title)}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Submission notes</strong><span>${escapeHTML(assignment.submissionNotes || "No notes provided.")}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Attached file</strong><span>${escapeHTML(assignment.submissionFile || "No file attached.")}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Submitted</strong><span>${escapeHTML(assignment.submittedAt || "Date unavailable")}</span></div></div>${assignment.feedback ? `<div class="simple-row"><div class="row-copy"><strong>Teacher feedback</strong><span>${escapeHTML(assignment.feedback)}${assignment.score !== undefined ? ` · ${assignment.score}/100` : ""}</span></div></div>` : ""}</div>` : `<p class="portal-description">Submission not found.</p>`; })() :
            modal.type === "message" ? `${field("To", "to", "", "text", true)}${field("Message", "message", "", "textarea", true)}` :
            modal.type === "grade" ? (() => { const assignment = state.assignments.find((item) => item.id === modal.id); return `${assignment ? `<div class="demo-note"><strong>${escapeHTML(assignment.title)}</strong><br>${escapeHTML(assignment.course)} · Due ${escapeHTML(assignment.due)}</div>` : ""}${field("Score (out of 100)", "score", assignment?.score ?? "90", "number", true)}${field("Feedback", "feedback", assignment?.feedback || "", "textarea")}`; })() :
            modal.type === "quiz-take" ? `<p class="portal-description">${escapeHTML(modal.quiz?.course || "")} · Choose the correct answer for each question.</p><fieldset class="quiz-question"><legend>1. Which language defines the structure of a web page?</legend>${["HTML", "CSS", "JavaScript"].map((answer) => `<label class="quiz-answer"><input type="radio" name="q1" value="${answer}" required><span>${answer}</span></label>`).join("")}</fieldset><fieldset class="quiz-question"><legend>2. Which language is used to style a web page?</legend>${["HTML", "CSS", "JavaScript"].map((answer) => `<label class="quiz-answer"><input type="radio" name="q2" value="${answer}" required><span>${answer}</span></label>`).join("")}</fieldset>` :
            modal.type === "lesson-view" ? (() => { const lesson = state.lessons.find((item) => item.id === modal.id); return lesson ? `<p class="portal-description">${escapeHTML(lesson.course)} · ${escapeHTML(lesson.type)}</p><div class="demo-note"><strong>Lesson overview</strong><br>${escapeHTML(lesson.description)}<br><br>Read the lesson notes, review the examples, and mark this lesson complete when you're ready.</div>` : `<p class="portal-description">Lesson not found.</p>`; })() :
            modal.type === "material-view" ? (() => { const material = state.materials.find((item) => item.id === modal.id); return material ? `<p class="portal-description">${escapeHTML(material.course)} · ${escapeHTML(material.type)}</p><div class="demo-note"><strong>${escapeHTML(material.title)}</strong><br>${escapeHTML(material.description)}<br><br>This demo shows learning material details. Add a backend or a real resource URL to serve downloadable files.</div>` : `<p class="portal-description">Learning material not found.</p>`; })() :
            modal.type === "student" ? (() => { const student = initialStudents.find((item) => item.name === modal.name); return student ? `<div class="simple-list"><div class="simple-row"><div class="row-copy"><strong>Email</strong><span>${escapeHTML(student.email)}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Enrolled course</strong><span>${escapeHTML(student.course)}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Learning progress</strong><span>${student.progress}% complete</span><div class="portal-progress" style="margin-top:9px"><span style="width:${student.progress}%"></span></div></div></div><div class="simple-row"><div class="row-copy"><strong>Assignments submitted</strong><span>${student.assignments}</span></div></div><div class="simple-row"><div class="row-copy"><strong>Average assessment score</strong><span>${student.average}%</span></div></div><div class="simple-row"><div class="row-copy"><strong>Status</strong><span>${escapeHTML(student.status)}</span></div></div></div>` : `<p class="portal-description">Student record not found.</p>`; })() :
            modal.type === "info" ? `<p class="portal-description">${escapeHTML(modal.message || "Your selection is ready.")}</p>` :
            `${field("Title", "title", "", "text", true)}${field("Details", "details", "", "textarea")}`;
        return `<div class="portal-modal-backdrop" data-modal-close><section class="portal-modal" role="dialog" aria-modal="true" aria-labelledby="portal-modal-title"><div class="portal-modal-head"><h2 id="portal-modal-title">${escapeHTML(modal.title)}</h2><button type="button" class="portal-btn ghost small" data-modal-close aria-label="Close dialog">✕</button></div><form id="portal-modal-form"><div class="portal-modal-body">${fields}</div><div class="portal-modal-foot">${modal.type === "info" || modal.type === "student" || modal.type === "submission-view" || modal.type === "material-view" || modal.type === "lesson-view" ? `<button type="button" class="portal-btn" data-modal-close>Close</button>${modal.type === "lesson-view" && !state.completedLessons.includes(modal.id) ? `<button type="button" class="portal-btn primary" data-action="lesson-complete" data-id="${modal.id}">Mark complete</button>` : `<button type="button" class="portal-btn primary" data-modal-close>Done</button>`}` : `<button type="button" class="portal-btn" data-modal-close>Cancel</button><button class="portal-btn primary" type="submit">${escapeHTML(modal.submitLabel || "Save")}</button>`}</div></form></section></div>`;
    }
    function field(label, name, value, type = "text", required = false) {
        const requiredAttr = required ? "required" : "";
        if (type === "textarea") return `<label class="portal-label" for="field-${name}">${escapeHTML(label)}</label><textarea class="portal-textarea" id="field-${name}" name="${name}" ${requiredAttr}>${escapeHTML(value)}</textarea>`;
        return `<label class="portal-label" for="field-${name}">${escapeHTML(label)}</label><input class="portal-input" id="field-${name}" name="${name}" type="${type}" value="${escapeHTML(value)}" ${requiredAttr}>`;
    }
    function selectField(label, name, options, selected = "") {
        return `<label class="portal-label" for="field-${name}">${escapeHTML(label)}</label><select class="portal-select" id="field-${name}" name="${name}" required>${options.map((value) => `<option value="${escapeHTML(value)}" ${value === selected ? "selected" : ""}>${escapeHTML(value)}</option>`).join("")}</select>`;
    }
    function onAction(event) {
        const target = event.currentTarget;
        const action = target.dataset.action;
        if (action === "toggle-menu") { root.querySelector("#portal-sidebar").classList.toggle("open"); return; }
        if (action === "theme") { StyleController.toggleTheme(); return; }
        if (action === "logout") { state.role = ""; state.name = ""; state.modal = null; renderLogin(); return; }
        const modal = (type, title, extra = {}) => { state.modal = { type, title, ...extra }; renderPortal(); };
        if (action === "course-new") modal("course", "Create a course", { submitLabel: "Create course" });
        else if (action === "course-edit") modal("course", "Edit course", { id: Number(target.dataset.id), submitLabel: "Save changes" });
        else if (action === "course-delete") {
            const course = state.courses.find((item) => item.id === Number(target.dataset.id));
            if (course && window.confirm(`Delete "${course.title}"? This action cannot be undone.`)) {
                state.courses = state.courses.filter((item) => item.id !== course.id);
                save("eteaching-courses", state.courses); renderPortal(); toast("Course deleted.");
            }
        } else if (action === "course-browse") { state.page = isTeacher() ? "Courses" : "My Courses"; renderPortal(); }
        else if (action === "course-open" || action === "course-select") {
            state.selectedCourseId = Number(target.dataset.id);
            state.page = "Course details";
            renderPortal();
        }
        else if (action === "course-lessons") { state.page = "Lessons"; renderPortal(); }
        else if (action === "all-lessons" || action === "all-materials") { state.selectedCourseId = null; renderPortal(); }
        else if (action === "lesson-new") modal("lesson", "Create a lesson", { submitLabel: "Create lesson" });
        else if (action === "lesson-edit") modal("lesson", "Edit lesson", { id: Number(target.dataset.id), submitLabel: "Save changes" });
        else if (action === "lesson-delete") {
            const lesson = state.lessons.find((item) => item.id === Number(target.dataset.id));
            if (lesson && window.confirm(`Delete "${lesson.title}"? This action cannot be undone.`)) {
                state.lessons = state.lessons.filter((item) => item.id !== lesson.id);
                save("eteaching-lessons", state.lessons); renderPortal(); toast("Lesson deleted.");
            }
        }
        else if (action === "assignment-new") modal("assignment", "Create an assignment");
        else if (action === "assignment-submit") modal("submit", "Submit assignment", { id: Number(target.dataset.id) });
        else if (action === "grade-assignment") modal("grade", "Review submission", { id: Number(target.dataset.id) });
        else if (action === "quiz-new") modal("quiz", "Build a quiz");
        else if (action === "quiz-edit") modal("quiz", "Edit quiz", { id: Number(target.dataset.id), submitLabel: "Save quiz" });
        else if (action === "take-quiz") {
            const quiz = state.quizzes.find((item) => item.id === Number(target.dataset.id));
            modal("quiz-take", quiz?.title || "Take a quiz", { id: quiz?.id, quiz, submitLabel: "Submit answers" });
        }
        else if (action === "event-new") modal("event", "Add calendar event");
        else if (action === "profile-edit") modal("profile", "Edit profile");
        else if (action === "message-new") modal("message", "Send a message");
        else if (action === "student-view") modal("student", target.dataset.name || "Student details", { name: target.dataset.name });
        else if (action === "certificate-view") modal("info", "Certificate", { message: `Congratulations, ${state.name}! Your "${target.dataset.title || "course"}" certificate is ready to view.` });
        else if (action === "notification-read") {
            state.notifications = state.notifications.map((item) => item.id === Number(target.dataset.id) ? { ...item, read: true } : item);
            save("eteaching-notifications", state.notifications);
            renderPortal();
        }
        else if (action === "notifications-read-all") {
            state.notifications = state.notifications.map((item) => ({ ...item, read: true }));
            save("eteaching-notifications", state.notifications);
            renderPortal();
        }
        else if (action === "export-report") { toast("Report prepared for export."); }
        else if (action === "go-submissions") { state.page = "Assignment submissions"; renderPortal(); }
        else if (action === "go-students") { state.page = "Students"; renderPortal(); }
        else if (action === "go-assignments") { state.page = "Assignments"; renderPortal(); }
        else if (action === "go-quizzes") { state.page = "Quizzes"; renderPortal(); }
        else if (action === "lesson-open") modal("lesson-view", state.lessons.find((item) => item.id === Number(target.dataset.id))?.title || "Lesson", { id: Number(target.dataset.id) });
        else if (action === "materials-open") modal("material-view", state.materials.find((item) => item.id === Number(target.dataset.id))?.title || "Learning material", { id: Number(target.dataset.id) });
        else if (action === "submission-view") modal("submission-view", "Your submission", { id: Number(target.dataset.id) });
        else if (action === "lesson-complete") {
            const lessonId = Number(target.dataset.id);
            const lesson = state.lessons.find((item) => item.id === lessonId);
            if (lesson && !state.completedLessons.includes(lessonId)) {
                state.completedLessons = [...state.completedLessons, lessonId];
                save("eteaching-completed-lessons", state.completedLessons);
                const course = state.courses.find((item) => item.title === lesson.course);
                if (course) {
                    course.progress = Math.min(100, Math.max(Number(course.progress) || 0, (Number(course.progress) || 0) + Math.ceil(100 / Math.max(1, Number(course.lessons) || 1))));
                    save("eteaching-courses", state.courses);
                }
            }
            state.modal = null; renderPortal(); toast("Lesson marked complete.");
        }
    }
    function submitModal(event) {
        event.preventDefault();
        if (!(event.target instanceof HTMLFormElement)) return;
        const form = new FormData(event.target);
        const data = Object.fromEntries(form.entries());
        const type = state.modal.type;
        if (type === "course") {
            const existing = state.modal.id && state.courses.find((item) => item.id === state.modal.id);
            const course = { id: existing?.id || Date.now(), title: data.title, category: data.category, description: data.description, lessons: Number(data.lessons), progress: existing?.progress || 0 };
            state.courses = existing ? state.courses.map((item) => item.id === existing.id ? course : item) : [course, ...state.courses];
            save("eteaching-courses", state.courses);
        } else if (type === "assignment") {
            state.assignments.unshift({ id: Date.now(), title: data.title, course: data.course, due: data.due, status: "Pending" });
            save("eteaching-assignments", state.assignments);
        } else if (type === "quiz") {
            const existing = state.modal.id && state.quizzes.find((item) => item.id === state.modal.id);
            const quiz = { id: existing?.id || Date.now(), title: data.title, course: data.course, questions: Number(data.questions), status: existing?.status || "Available" };
            state.quizzes = existing ? state.quizzes.map((item) => item.id === existing.id ? quiz : item) : [quiz, ...state.quizzes];
            save("eteaching-quizzes", state.quizzes);
        } else if (type === "lesson") {
            const existing = state.modal.id && state.lessons.find((item) => item.id === state.modal.id);
            const lesson = { id: existing?.id || Date.now(), title: data.title, course: data.course, type: data.type, description: data.description };
            state.lessons = existing ? state.lessons.map((item) => item.id === existing.id ? lesson : item) : [lesson, ...state.lessons];
            save("eteaching-lessons", state.lessons);
        } else if (type === "submit") {
            const assignment = state.assignments.find((item) => item.id === state.modal.id);
            if (assignment) {
                assignment.status = "Submitted";
                assignment.submissionNotes = String(data.notes || "");
                assignment.submissionFile = data.file instanceof File && data.file.name ? data.file.name : "";
                assignment.submittedAt = new Date().toLocaleDateString();
            }
            save("eteaching-assignments", state.assignments);
        } else if (type === "grade") {
            const assignment = state.assignments.find((item) => item.id === state.modal.id);
            if (assignment) {
                assignment.status = "Graded";
                assignment.score = Number(data.score);
                assignment.feedback = data.feedback;
            }
            save("eteaching-assignments", state.assignments);
        } else if (type === "event") {
            state.events.unshift({ id: Date.now(), title: data.title, date: data.date, details: data.details || "Online" });
            save("eteaching-events", state.events);
        } else if (type === "message") {
            state.messages.unshift({ id: Date.now(), to: data.to, message: `${state.name}: ${data.message}` });
            save("eteaching-messages", state.messages);
        } else if (type === "profile") state.name = String(data.name).trim();
        else if (type === "quiz-take") {
            const quiz = state.quizzes.find((item) => item.id === state.modal.id);
            const score = Number(data.q1 === "HTML") * 50 + Number(data.q2 === "CSS") * 50;
            if (quiz) {
                state.quizResults.unshift({
                    id: Date.now(),
                    title: quiz.title,
                    course: quiz.course,
                    score,
                    date: new Date().toLocaleDateString()
                });
                save("eteaching-quiz-results", state.quizResults);
            }
            state.modal = { type: "info", title: "Quiz results", message: `You scored ${score}%${score >= 70 ? " — passed!" : " — keep practicing."} Your result has been saved.` };
            renderPortal(); toast("Quiz submitted and result saved."); return;
        }
        state.modal = null;
        renderPortal();
        toast(type === "submit" ? "Assignment submitted." : type === "profile" ? "Profile updated." : "Changes saved.");
    }
    function closeModal(event) {
        if (event && event.target !== event.currentTarget && !event.target.closest("[data-modal-close]")) return;
        state.modal = null;
        renderPortal();
    }
    function toast(message) {
        root.querySelector(".portal-toast")?.remove();
        const element = document.createElement("div");
        element.className = "portal-toast";
        element.setAttribute("role", "status");
        element.textContent = message;
        root.append(element);
        window.setTimeout(() => element.remove(), 2800);
    }

    document.addEventListener("DOMContentLoaded", () => {
        renderLogin();
        root.addEventListener("submit", (event) => {
            if (event.target instanceof HTMLFormElement && event.target.id === "portal-modal-form") submitModal(event);
        });
        root.addEventListener("click", (event) => {
            if (event.target.classList.contains("portal-modal-backdrop")) closeModal(event);
        });
    });
})();
