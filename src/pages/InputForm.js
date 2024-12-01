import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { BsPersonCircle } from "react-icons/bs"; // Student icon for placeholder

const InputForm = ({ onAddStudent, editMode, currentStudent, onSaveStudent, onCancelEdit }) => {
  // State for storing form input
  const [formData, setFormData] = useState({
    studentName: "",
    planType: "",
    disabilityType: "",
    transportation: "",
    hasCompanion: "",
    hasAssistant: "",
    hasReports: "",
    classLevel: "",
    nationality: "",
    schoolName: "",
    birthDate: "",
    teacherName: "",
    studentId: "",
    therapy: "",
    attachedFiles: [], // Change to array for multiple files
    studentPhoto: null,
    studentPhotoName: ""
  });
  
 useEffect(() => {
  if (editMode && currentStudent) {
    setFormData(currentStudent);
  }
}, [editMode, currentStudent]);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    const updatedFiles = files.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve({
            fileName: file.name,
            fileData: reader.result
          });
        };
      });
    });
  
    // Wait for all files to be read
    Promise.all(updatedFiles).then(fileDataArray => {
      setFormData(prevFormData => ({
        ...prevFormData,
        attachedFiles: [...prevFormData.attachedFiles, ...fileDataArray] // Append new files
      }));
    });
  };
  

  const handlePhotoChange = (e) => {
    const photo = e.target.files[0];
    if (photo) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          studentPhoto: reader.result, // base64 photo data
          studentPhotoName: photo.name
        });
      };
      reader.readAsDataURL(photo); // Convert photo to base64 string
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (editMode) {
      onSaveStudent(formData); // Call the save function
    } else {
      onAddStudent(formData); // Add new student
    }
  
    // Reset the form
    setFormData({
      studentName: "",
      planType: "",
      disabilityType: "",
      transportation: "",
      hasCompanion: "",
      hasAssistant: "",
      hasReports: "",
      classLevel: "",
      nationality: "",
      schoolName: "",
      birthDate: "",
      teacherName: "",
      studentId: "",
      therapy: "",
      attachedFiles: [],
      studentPhoto: null,
      studentPhotoName: "",
    });
  };
  
  

  return (
    // <Container>
    <Form onSubmit={handleSubmit} className="form-submit">
 {/* Student Photo Upload with Circular Icon */}
 <Row>
        <Col md={12} className="text-center">
          <div
            className="photo-upload-circle"
            onClick={() => document.getElementById("photoUploadInput").click()}
          >
            {formData.studentPhoto ? (
              <img
                src={formData.studentPhoto}
                alt="Student"
                className="uploaded-photo"
              />
            ) : (
              <BsPersonCircle className="icon-placeholder" />
            )}
          </div>
          <input
            type="file"
            id="photoUploadInput"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="studentName">
            <Form.Label>اسم الطالب</Form.Label>
            <Form.Control
              type="text"
              placeholder="أدخل اسم الطالب"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group controlId="studentId">
            <Form.Label>رقم الطالب</Form.Label>
            <Form.Control
              type="text"
              placeholder="أدخل رقم الطالب"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
      {/* Dropdown for Plan Type */}
      <Col md={4}>
      <Form.Group controlId="planType">
        <Form.Label>نوع الخطة</Form.Label>
        <Form.Control
          as="select"
          name="planType"
          value={formData.planType}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع الخطة</option>
          <option value="خطة تكييف">خطة تكييف</option>
          <option value="خطة تعديل">خطة تعديل</option>
        </Form.Control>
      </Form.Group>
      </Col>
      {/* Dropdown for Disability Type */}
      <Col md={4}>
      <Form.Group controlId="disabilityType">
        <Form.Label>نوع الإعاقة</Form.Label>
        <Form.Control
          as="select"
          name="disabilityType"
          value={formData.disabilityType}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع الإعاقة</option>
          <option value="غير مصنف">غير مصنف</option>
          <option value="الإعاقة السمعية">الإعاقة السمعية</option>
          <option value="الإعاقة البصرية">الإعاقة البصرية</option>
          <option value="اضطرابات طيف التوحد">اضطرابات طيف التوحد</option>
          <option value="اضطرابات التواصل ">اضطرابات التواصل </option>
          <option value="الاضطرابات الانفعالية">الاضطرابات الانفعالية</option>
          <option value="الاعاقة الجسدية">الاعاقة الجسدية</option>
          <option value="الإعاقة الذهنية">الإعاقة الذهنية</option>
          <option value="صعوبات التعلم المحددة">صعوبات التعلم المحددة</option>
          <option value="الأمراض الصحية">الأمراض الصحية</option>
          <option value="الاعاقات المتعددة">الاعاقات المتعددة</option>
          {/* Add the rest of the options here */}
        </Form.Control>
      </Form.Group>
      </Col>
      {/* Dropdown for Transportation */}
      <Col md={4}>
      <Form.Group controlId="transportation">
        <Form.Label>المواصلات</Form.Label>
        <Form.Control
          as="select"
          name="transportation"
          value={formData.transportation}
          onChange={handleChange}
          required
        >
          <option value="">اختر نوع المواصلات</option>
          <option value="حافلة عادية">حافلة عادية</option>
          <option value="سيارة خاصة">سيارة خاصة</option>
          <option value="سيارة مواصلات">سيارة مواصلات</option>
        </Form.Control>
      </Form.Group>
      </Col>
    </Row>


      {/* Companion, Assistant, Reports */}
      <Row>
        <Col md={4}>
          <Form.Group controlId="hasCompanion">
            <Form.Label>وجود مرافق</Form.Label>
            <Form.Control
              as="select"
              name="hasCompanion"
              value={formData.hasCompanion}
              onChange={handleChange}
              required
            >
              <option value="">اختر</option>
              <option value="نعم">نعم</option>
              <option value="لا">لا</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="hasAssistant">
            <Form.Label>وجود مساعد</Form.Label>
            <Form.Control
              as="select"
              name="hasAssistant"
              value={formData.hasAssistant}
              onChange={handleChange}
              required
            >
              <option value="">اختر</option>
              <option value="نعم">نعم</option>
              <option value="لا">لا</option>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="hasReports">
            <Form.Label>وجود تقارير</Form.Label>
            <Form.Control
              as="select"
              name="hasReports"
              value={formData.hasReports}
              onChange={handleChange}
              required
            >
              <option value="">اختر</option>
              <option value="نعم">نعم</option>
              <option value="لا">لا</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row>
      <Col md={6}>
      <Form.Group controlId="fileUpload">
  <Form.Label>إرفاق تقارير</Form.Label>
  <Form.Control
    type="file"
    onChange={handleFileChange}
    accept=".pdf, .doc, .docx, .png, .jpg, .jpeg, .gif, .bmp"
    multiple // Allow multiple files
  />
</Form.Group>

      </Col>

      
      <Col md={6}>
          <Form.Group controlId="therapy">
            <Form.Label>الخدمات المساندة </Form.Label>
            <Form.Control
              as="select"
              name="therapy"
              value={formData.therapy}
              onChange={handleChange}
              required
            >
              <option value="">اختر</option>
              <option value="لا يوجد">لا يوجد</option>
              <option value="علاج وظيفي">علاج وظيفي</option>
              <option value="علاج نطقي">علاج نطقي</option>
              <option value="علاج طبيعي">علاج طبيعي</option>
              <option value="علاج السلوك">علاج السلوك</option>
            </Form.Control>
          </Form.Group>
        </Col>
        </Row>
      {/* Class Level */}
      <Row>
      <Col md={4}>
      <Form.Group controlId="classLevel">
        <Form.Label>الصف</Form.Label>
        <Form.Control
          as="select"
          name="classLevel"
          value={formData.classLevel}
          onChange={handleChange}
          required
        >
          <option value="">اختر الصف</option>
          <option value="روضة 1">روضة 1</option>
          <option value="روضة 2">روضة 2</option>
          <option value="الصف الأول">الصف الأول</option>
          <option value="الصف الثاني">الصف الثاني</option>
          <option value="الصف الثالث">الصف الثالث</option>
          <option value="الصف الرابع">الصف الرابع</option>
          <option value="الصف الخامس">الصف الخامس</option>
          <option value="الصف السادس">الصف السادس</option>
          <option value="الصف السابع">الصف السابع</option>
          <option value="الصف الثامن">الصف الثامن</option>
          <option value="الصف التاسع">الصف التاسع</option>
          <option value="الصف العاشر">الصف العاشر</option>
          <option value="الصف الحادي عشر">الصف الحادي عشر</option>
          <option value="الصف الثاني عشر">الصف الثاني عشر</option>

          {/* Add the rest of the class levels here */}
        </Form.Control>
      </Form.Group>
      </Col>
      {/* Birth Date */}
      <Col md={4}>
      <Form.Group controlId="birthDate">
        <Form.Label>تاريخ الميلاد</Form.Label>
        <Form.Control
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />
      </Form.Group>
      </Col>

      {/* Nationality */}
      <Col md={4}>
      <Form.Group controlId="nationality">
        <Form.Label>الجنسية</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل الجنسية"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
          required
        />
      </Form.Group>
      </Col>
      </Row>


      {/* School Name */}
      <Row>
      <Col md={6}>
      <Form.Group controlId="schoolName">
        <Form.Label>اسم المدرسة</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم المدرسة"
          name="schoolName"
          value={formData.schoolName}
          onChange={handleChange}
          required
        />
      </Form.Group>
      </Col>
      {/* Teacher Name */}
      <Col md={6}>
      <Form.Group controlId="teacherName">
        <Form.Label>اسم المعلم المشرف</Form.Label>
        <Form.Control
          type="text"
          placeholder="أدخل اسم المعلم"
          name="teacherName"
          value={formData.teacherName}
          onChange={handleChange}
          required
        />
      </Form.Group>
      </Col>
      </Row>


      {/* Submit Button */}
      <div className="form-btn">
        {/* Add a Cancel button if in edit mode */}
      {editMode && (
        <Button variant="secondary" onClick={onCancelEdit} className="cancle-btn">
          إلغاء
        </Button>
      )}
      <Button variant="primary" type="submit" className="save-btn">
        {editMode ? "حفظ التعديلات" : "إضافة الطالب"}
      </Button>
      {/* <Button variant="primary" type="submit" >
        حفظ الطالب
      </Button>         */}
      </div>

    </Form>
    // </Container>
  );
};

export default InputForm;
