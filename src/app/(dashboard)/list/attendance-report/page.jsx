import MonthlyReport from "../../../../components/MontlhyReport";
import { studentsData as students, attendanceData as attendance } from "../../../../lib/data";

const AttendanceReport = () => {
  const month = "2023-10";

  return (
    <div className="mx-2 rounded-lg p-4 bg-white">
      <MonthlyReport
        students={students}
        attendanceData={attendance}
        month={month}
      />
    </div>
  );
};

export default AttendanceReport;
