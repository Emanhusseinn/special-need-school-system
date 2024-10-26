// App.js
import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Row, Col, Form, Nav } from 'react-bootstrap';
import InputForm from './pages/InputForm';
import LoginPage from './LoginPage';
import { getFromLocalStorage, saveToLocalStorage } from './utils/localStorage';
import { BsPersonCircle } from "react-icons/bs";

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastAddedStudent, setLastAddedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load login status and students from local storage when the component mounts
  useEffect(() => {
    const savedStudents = getFromLocalStorage('students') || [];
    setStudents(savedStudents.reverse());
    
    const savedLoginStatus = getFromLocalStorage('isLoggedIn');
    setIsLoggedIn(savedLoginStatus === "true");
  }, []);

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
    saveToLocalStorage('isLoggedIn', "true"); // Save login status
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    saveToLocalStorage('isLoggedIn', "false"); // Clear login status
  };

  // Handle adding a new student
  const handleAddStudent = (updatedStudents) => {
    setStudents(updatedStudents.reverse());
    setLastAddedStudent(updatedStudents[0]);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Filter students based on the search term
  const filteredStudents = students.filter(student =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If not logged in, show the Login Page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Main app content when logged in
  return (
    <Container>
      {/* Header with Tabs and Logout Button */}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)} className='nav-system'>
        <Nav.Item>
          <Nav.Link eventKey="add">إضافة طالب</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="list">كل الطلاب</Nav.Link>
        </Nav.Item>
        <Nav.Item className="ml-auto">
          <Button variant="mt-3 btn btn-primary" onClick={handleLogout}>
            تسجيل الخروج
          </Button>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      {activeTab === 'add' && (
        <div>
          <h1>إضافة طالب</h1>
          <InputForm onAddStudent={handleAddStudent} />
        </div>
      )}

      {activeTab === 'list' && (
        <div>
          <h1>كل الطلاب</h1>

          {/* Search Bar */}
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="ابحث عن الطالب"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          {/* Display Students */}
          <div className="student-list">
            <Row>
              {filteredStudents.map((student, index) => (
                <Col md={6} sm={12} key={index} className="mb-4">
                  <div className="student-card">
                    <div className="student-details">
                      {/* Student Info and Photo */}
                      <div className="photo-name">
                        <div className="photo-upload-circle-display">
                          {student.studentPhoto ? (
                            <img
                              src={student.studentPhoto}
                              alt="Student"
                              className="uploaded-photo"
                            />
                          ) : (
                            <BsPersonCircle className="icon-placeholder" />
                          )}
                        </div>
                        <p className="student-name">{student.studentName}</p>
                      </div>

                      {/* Student Info */}
                      <div className="student-info">
                        <div className="student-info-grid">
                          <div><strong>نوع الخطة:</strong> {student.planType}</div>
                          <div><strong>نوع الإعاقة:</strong> {student.disabilityType}</div>
                          <div><strong>المواصلات:</strong> {student.transportation}</div>
                          <div><strong>وجود مرافق:</strong> {student.hasCompanion}</div>
                          <div><strong>وجود مساعد:</strong> {student.hasAssistant}</div>
                          <div><strong>وجود خدمات مساندة:</strong> {student.therapy}</div>
                          <div><strong>الصف:</strong> {student.classLevel}</div>
                          <div><strong>تاريخ الميلاد:</strong> {student.birthDate}</div>
                          <div><strong>الجنسية:</strong> {student.nationality}</div>
                          <div><strong>اسم المدرسة:</strong> {student.schoolName}</div>
                          <div><strong>اسم المعلم المشرف:</strong> {student.teacherName}</div>
                          <div><strong>رقم الطالب:</strong> {student.studentId}</div>
                        </div>
                      </div>
                    </div>

                    {/* File Download Section */}
                    {student.attachedFile && (
                      <div className="file-section">
                        <i className="fas fa-file-alt file-icon"></i>
                        <a href={student.attachedFile} download={student.attachedFileName}>
                          <button className="download-btn">تحميل {student.attachedFileName}</button>
                        </a>
                      </div>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>تم حفظ الطالب بنجاح</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          تم حفظ الطالب <strong>{lastAddedStudent?.studentName}</strong> بنجاح!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
