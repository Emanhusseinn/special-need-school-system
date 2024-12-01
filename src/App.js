import React, { useState, useEffect } from 'react';
import { Container, Modal, Button, Row, Col, Form, Nav } from 'react-bootstrap';
import InputForm from './pages/InputForm';
import LoginPage from './LoginPage';
import { getFromLocalStorage, getIsLoggedIn, setIsSignedIn,saveToLocalStorage } from './utils/localStorage';
import { BsPersonCircle } from "react-icons/bs";
import { updateStudent, deleteStudent } from './utils/localStorage'; // Import new utilities
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { Spinner } from "react-bootstrap"; // Import Spinner from Bootstrap

function App() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [lastAddedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  // Function to open the modal and set the selected attachments
  const handleShowAttachments = (attachments) => {
    setSelectedAttachments(attachments);
    setShowAttachmentsModal(true);
  };


  const handleDownloadExcelFile = (student) => {
    try {
      // Prepare the student data as an array of objects
      const studentData = [
        { Key: "اسم الطالب", Value: student.studentName || "غير متوفر" },
        { Key: "رقم الطالب", Value: student.studentId || "غير متوفر" },
        { Key: "نوع الخطة", Value: student.planType || "غير متوفر" },
        { Key: "نوع الإعاقة", Value: student.disabilityType || "غير متوفر" },
        { Key: "المواصلات", Value: student.transportation || "غير متوفر" },
        { Key: "الصف", Value: student.classLevel || "غير متوفر" },
        { Key: "تاريخ الميلاد", Value: student.birthDate || "غير متوفر" },
        { Key: "الخدمات المساندة", Value: student.therapy || "غير متوفر" },
        { Key: "اسم المدرسة", Value: student.schoolName || "غير متوفر" },
        { Key: "اسم المعلم المشرف", Value: student.teacherName || "غير متوفر" },
        { Key: "رقم التواصل", Value: student.contactNumber || "غير متوفر" },
      ];
  
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(studentData, {
        header: ["Key", "Value"],
      });
  
      // Create a workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");
  
      // Export the workbook as a file
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
  
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
  
      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${student.studentName || "student"}_data.xlsx`;
  
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error generating Excel file:", error);
      alert("حدث خطأ أثناء إنشاء ملف الإكسل");
    }
  };
  
  
  
  // Function to close the modal
  const handleCloseAttachmentsModal = () => setShowAttachmentsModal(false);

  useEffect(() => {
    getFromLocalStorage('students', (fetchedStudents) => {
      if (fetchedStudents) {
        setStudents(fetchedStudents);
      }
    });
  
    const savedLoginStatus = getIsLoggedIn('isLoggedIn');
    setIsLoggedIn(savedLoginStatus === "true");
  }, []);

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsSignedIn('isLoggedIn', "true"); // Save login status
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSignedIn('isLoggedIn', "false"); // Clear login status
  };
  const refreshStudents = async () => {
    try {
      // Fetch updated student data from your backend or localStorage
      const fetchedStudents = await getFromLocalStorage("students", setStudents);
      if (fetchedStudents) {
        setStudents(fetchedStudents); // Update the state with the new data
      }
    } catch (error) {
      console.error("Error refreshing students:", error);
      alert("حدث خطأ أثناء تحديث قائمة الطلاب.");
    }
  };
  
  // Handle adding a new student
  const handleAddStudent = async (newStudent) => {
    setLoading(true); // Show spinner while saving
    try {
      await saveToLocalStorage("students", newStudent); // Save to Supabase
      await refreshStudents(); // Refresh the list dynamically
      setShowModal(true);
      setActiveTab("list"); // Switch to the list tab
    } catch (error) {
      console.error("Error adding student:", error);
      alert("حدث خطأ أثناء إضافة الطالب");
    } finally {
      setLoading(false); // Hide spinner
    }
  };
  
  useEffect(() => {
    refreshStudents();
  }, []);
  

  const handleCloseModal = () => setShowModal(false);

  // Start edit mode with selected student data
  const handleEditStudent = (student) => {
    setEditMode(true);
    setCurrentStudent(student); // Pass the student data
    setActiveTab("add"); // Switch to the form tab
  };

  // Save updated student data
  const handleSaveStudent = async (updatedStudent) => {
    try {
      await updateStudent("students", updatedStudent.id, updatedStudent); // Update in Supabase
      setStudents((prev) =>
        prev.map((stud) => (stud.id === updatedStudent.id ? updatedStudent : stud))
      );

      alert("تم تحديث بيانات الطالب بنجاح");
      setActiveTab("list");
    } catch (error) {
      console.error("Error updating student:", error);
      alert("حدث خطأ أثناء تحديث بيانات الطالب");
    }
    setEditMode(false); // Exit edit mode
    setCurrentStudent(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setCurrentStudent(null);
    setActiveTab("list");
  };

  const handleDeleteStudent = async (studentId) => {
    setLoading(true); // Show spinner
    console.log("Attempting to delete student with ID:", studentId);
  
    // Perform deletion
    const response = await deleteStudent("students", studentId);
  
    if (response.success) {
      console.log("Student deleted successfully from Supabase.");
  
      // Force a data refresh by fetching students again
      getFromLocalStorage('students', (fetchedStudents) => {
        setStudents(fetchedStudents);
        console.log("Data refreshed after deletion:", fetchedStudents);
        setLoading(false); // hide spinner
      });
    } else {
      console.error("Failed to delete student. Error:", response.error);
      alert("Failed to delete student due to an error. Please reload  .");
    }
  };
  

  // Filter students based on the search term
  const filteredStudents = students.filter(student => {
    const studentData = Object.values(student).join(' ').toLowerCase();
    return studentData.includes(searchTerm.toLowerCase());
  });

  // If not logged in, show the Login Page
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Container>
       {loading && ( // Conditionally render the spinner
        <div className="spinner-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)} className='nav-system'>
        <Nav.Item>
          <Nav.Link eventKey="add">{editMode ? "تعديل طالب" : "إضافة طالب"}</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="list">كل الطلاب</Nav.Link>
        </Nav.Item>
        <Nav.Item className="ml-auto">
          <Button variant="mt-3 btn btn-primary" onClick={handleLogout}>تسجيل الخروج</Button>
        </Nav.Item>
      </Nav>

      {activeTab === 'add' && (
        <div>
          <h1>{editMode ? "تعديل الطالب" : "إضافة طالب"}</h1>
<InputForm 
  onAddStudent={handleAddStudent}          // This is the function to handle adding a new student.
  editMode={editMode}                      // A boolean indicating whether the form is in edit mode.
  currentStudent={currentStudent}          // The student data to pre-fill the form when in edit mode.
  onSaveStudent={handleSaveStudent}        // The function to handle saving the updated student data.
  onCancelEdit={handleCancelEdit}
/>
        </div>
      )}

      {activeTab === 'list' && (
        <div>
          <h1>كل الطلاب</h1>
          <Form.Group controlId="search" className='search-bar'>
            <Form.Control
              type="text"
              placeholder="ابحث عن الطالب"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
          <div className="student-list">
            <p className="count-btn">عدد الطلاب: {filteredStudents.length}</p>
            {filteredStudents.length === 0 ? (
        <div className="spinner-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
            <Row>
              {filteredStudents.map((student, index) => (
                <Col md={6} sm={12} key={index} className="mb-4">
                  <div className="student-card">
                                        {/* Edit and Delete Buttons */}
                  <div className="student-actions">
                    <button  onClick={() => handleDeleteStudent(student.id)}><MdDelete/> حذف الطالب</button>
                    <button  onClick={() => handleEditStudent(student)}> <MdEdit/> تعديل الطالب</button>
                      
                 
                    </div>
                    <div className="student-details">
                      <div className="photo-name">
                        <div className='download-info'>
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
                        <p className="student-name">{student.studentName}</p></div>
                        <div className="FaDownload">
                      <FaDownload onClick={() => handleDownloadExcelFile(student)}/>
                    </div>
                      </div>

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
                          <p><strong>رقم التواصل:</strong> {student.contactNumber}</p>
                        </div>
                      </div>
                    </div>

                    {student.attachedFiles && student.attachedFiles.length > 0 ? (
                      <button
                        className="download-btn"
                        onClick={() => handleShowAttachments(student.attachedFiles)}
                      >
                        ملفات الطالب
                      </button>
                    ) : (
                      <p className="count-btn">لا يوجد ملفات للطالب</p>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
            )}
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>تم حفظ الطالب بنجاح</Modal.Title>
        </Modal.Header>
        <Modal.Body>تم حفظ الطالب <strong>{lastAddedStudent?.studentName}</strong> بنجاح!</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>إغلاق</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAttachmentsModal} onHide={handleCloseAttachmentsModal}>
        <Modal.Header closeButton>
          <Modal.Title>ملفات الطالب</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAttachments.length > 0 ? (
            selectedAttachments.map((file, index) => (
              <div key={index} className="file-item">
                <a href={file.fileData} download={file.fileName}>
                  <button className="download-btn">تحميل {file.fileName}</button>
                </a>
              </div>
            ))
          ) : (
            <p>لا توجد ملفات للطالب.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAttachmentsModal}>إغلاق</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;
