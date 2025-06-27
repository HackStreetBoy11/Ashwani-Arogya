import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);

  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsRes, doctorsRes, adminsRes] = await Promise.all([
          axios.get("http://localhost:4000/api/v1/appointment/getall", {
            withCredentials: true,
          }),
          axios.get("http://localhost:4000/api/v1/user/doctors", {
            withCredentials: true,
          }),
          axios.get("http://localhost:4000/api/v1/user/admin/getall", {
            withCredentials: true,
          }),
        ]);

        setAppointments(appointmentsRes.data.appointments || []);
        setDoctors(doctorsRes.data.doctors || []);
        setAdmins(adminsRes.data.admins || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading dashboard data");
        setAppointments([]);
        setDoctors([]);
        setAdmins([]);
      }
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? { ...a, status } : a))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed.");
    }
  };

  if (!isAuthenticated) return <Navigate to={"/login"} />;

  return (
    <>
      <section className="dashboard page">
        <div className="banner">
          <div className="firstBox">
            <img src="/doc.png" alt="docImg" />
            <div className="content">
              <div>
                <p>Hello ,</p>
                <h5>{admin && `${admin.firstName} ${admin.lastName}`}</h5>
              </div>
              <p>
                Welcome back! As an admin, you’re empowered to manage appointments, monitor platform activity, and oversee operations. Keep everything running smoothly with real-time insights and updates.
              </p>
            </div>
          </div>
          <div className="secondBox">
            <p>Total Appointments</p>
            <h3>{appointments.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Registered Doctors</p>
            <h3>{doctors.length}</h3>
          </div>
          <div className="thirdBox">
            <p>Total Admins</p>
            <h3>{admins.length}</h3>
          </div>
        </div>

        <div className="banner">
          <h5>Appointments</h5>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Status</th>
                <th>Visited</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{`${appointment.firstName} ${appointment.lastName}`}</td>
                    <td>{appointment.appointment_date?.substring(0, 16)}</td>
                    <td>{`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}</td>
                    <td>{appointment.department}</td>
                    <td>
                      <select
                        className={
                          appointment.status === "Pending"
                            ? "value-pending"
                            : appointment.status === "Confirmed"
                              ? "value-accepted"
                              : "value-rejected"
                        }
                        value={appointment.status}
                        onChange={(e) =>
                          handleUpdateStatus(appointment._id, e.target.value)
                        }
                      >
                        <option value="Pending" className="value-pending">Pending</option>
                        <option value="Confirmed" className="value-accepted">Confirmed</option>
                        <option value="Cancelled" className="value-rejected">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      {appointment.hasVisited ? (
                        <GoCheckCircleFill className="green" />
                      ) : (
                        <AiFillCloseCircle className="red" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Appointments Found!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
