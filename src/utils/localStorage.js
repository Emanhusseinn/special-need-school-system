import { supabase } from "../config";
// Utility to save data to localStorage
// Utility to save data to Supabase
export const saveToLocalStorage = async (id, studentData) => {
  try {
    await supabase.from(id).insert([{ data: studentData }]); // Wrap data inside `{ data: studentData }`
  } catch (error) {
    console.log("Error saving data:", error);
  }
};



export const getFromLocalStorage = async (key, setStudentData) => {
  try {
    const { data, error } = await supabase.from("students").select("*");
    if (error) throw error;

    const unwrappedData = data.map((item) => ({
      id: item.id, // Ensure ID is included
      ...item.data, // Extract student details
    }));

    console.log("Fetched students data:", unwrappedData);
    setStudentData(unwrappedData);
  } catch (error) {
    console.error("Error fetching students:", error);
  }
};

  




export const update = async (key) => {
  return await supabase
    .from("student")
    .update({ content: "Updated content" })
    .eq("key", key);

  // if (error) console.error(erro  r);
  // else console.log('Post updated:', data);
};

export const getAllFromLocalstorage = async () => {
  const { data, error } = await supabase.from("students").select("*");
  if (!error) {
    return data;
  }
  if (error) {
    console.error("Error fetching post:", error);
  }
};



export const getIsLoggedIn = (key)=>{
  return localStorage.getItem(key);

}


export const setIsSignedIn = (key, value)=>{
  return localStorage.setItem(key, value);

}


export const updateStudent = async (table, studentId, studentData) => {
  try {
    await supabase.from(table).update({ data: studentData }).eq("id", studentId);
  } catch (error) {
    console.error("Error updating student:", error);
  }
};


export const deleteStudent = async (tableName, studentId) => {
  console.log("Attempting to delete from table:", tableName, "with ID:", studentId);
  
  const { data, error, status } = await supabase
    .from(tableName)
    .delete()
    .eq("id", studentId);

  if (error) {
    console.error("Supabase delete error:", error.message);
    return { success: false, error };
  } else {
    console.log("Deletion status:", status, "Deleted data:", data);
    return { success: true };
  }
};
