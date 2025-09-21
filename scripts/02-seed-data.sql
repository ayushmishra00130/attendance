-- Adding sample data for testing
-- Insert sample users
INSERT INTO users (email, name, role, student_id) VALUES
('teacher@example.com', 'Dr. Priya Sharma', 'teacher', NULL),
('admin@example.com', 'Admin User', 'admin', NULL),
('student1@example.com', 'Arjun Patel', 'student', 'STU001'),
('student2@example.com', 'Kavya Menon', 'student', 'STU002'),
('student3@example.com', 'Rohan Gupta', 'student', 'STU003'),
('student4@example.com', 'Anjali Reddy', 'student', 'STU004'),
('student5@example.com', 'Vikram Joshi', 'student', 'STU005')
ON CONFLICT (email) DO NOTHING;

-- Insert sample classes
INSERT INTO classes (name, code, teacher_id, description) VALUES
('Mathematics 101', 'MATH101', 1, 'Introduction to Calculus'),
('Physics 201', 'PHYS201', 1, 'Classical Mechanics'),
('Computer Science 301', 'CS301', 1, 'Data Structures and Algorithms')
ON CONFLICT (code) DO NOTHING;

-- Enroll students in classes
INSERT INTO enrollments (class_id, student_id) VALUES
(1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 3), (2, 4), (2, 5),
(3, 4), (3, 5), (3, 6), (3, 7)
ON CONFLICT (class_id, student_id) DO NOTHING;

-- Insert sample class sessions
INSERT INTO class_sessions (class_id, session_date, start_time, end_time, is_active) VALUES
(1, CURRENT_DATE, '09:00:00', '10:30:00', false),
(1, CURRENT_DATE - INTERVAL '1 day', '09:00:00', '10:30:00', false),
(1, CURRENT_DATE - INTERVAL '2 days', '09:00:00', '10:30:00', false),
(2, CURRENT_DATE, '11:00:00', '12:30:00', false),
(3, CURRENT_DATE, '14:00:00', '15:30:00', false);

-- Insert sample attendance records
INSERT INTO attendance (session_id, student_id, status) VALUES
(1, 3, 'present'), (1, 4, 'present'), (1, 5, 'absent'), (1, 6, 'present'), (1, 7, 'late'),
(2, 3, 'present'), (2, 4, 'absent'), (2, 5, 'present'),
(3, 4, 'present'), (3, 5, 'present'), (3, 6, 'present'), (3, 7, 'present');
