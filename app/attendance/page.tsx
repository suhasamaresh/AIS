"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    interface Subject {
        BRCODE: string;
        EMPLOYEEID: string;
        PKY: number;
        RESULT_YEAR: string;
        SECT: string;
        SEMESTER: number;
        SUBCODE: string;
    }

    interface FacultyName {
        FACULTY_NAME: string;
    }

    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [facultyname, setFacultyname] = useState<FacultyName[]>([]);

    const encode = (data: any) => {
        const subjectcode = data.SUBCODE;
        const section = data.SECT;
        const combined = subjectcode + section;
        return btoa(combined);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/get_faculty_courses?employeeId=CSU20');
                if (!response.ok) {
                    throw new Error("Failed to fetch courses");
                }
                const data = await response.json();
                setSubjects(data.courses);
            } catch (error) {
                console.error('Failed to fetch subjects:', error);
            }
        };

        const fetchFacultyName = async () => {
            try {
                const response = await fetch('/api/fetch_faculty_name?employeeID=CSU20');
                if (!response.ok) {
                    throw new Error("Failed to fetch faculty name");
                }
                const data = await response.json();
                setFacultyname(data.courses);
            } catch (error) {
                console.error('Failed to fetch faculty name:', error);
            }
        }

        fetchData();
        fetchFacultyName();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-left p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Subjects</h1>

            {/* Faculty Details Card */}
            <div className="text-left shadow-md rounded-lg bg-blue-500 p-6 border border-gray-200 mb-8 w-full ">
                <p className="text-white text-xl ">
                    Faculty Name: 
                    {facultyname.length > 0 
                        ? facultyname.map(faculty => faculty.FACULTY_NAME).join(', ') 
                        : "Loading..."}
                </p>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.length > 0 ? (
                    subjects.map((subject: Subject, index: number) => (
                        <Link
                            key={index}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                            href={`/attendance/${encode({ SUBCODE: subject.SUBCODE, SECT: subject.SECT })}`}
                        >
                            <div className="flex flex-col text-left">
                                <h2 className="text-xl font-semibold text-gray-700 mb-2">Semester:
                                    {subject.SEMESTER}
                                </h2>
                                <p className="text-gray-500">Subject Code: {subject.SUBCODE}</p>
                                <p className="text-gray-500">Section: {subject.SECT}</p>
                                <p className="text-gray-500">Branch Code: {subject.BRCODE}</p>
                                <p className="text-gray-500">Result Year: {new Date(subject.RESULT_YEAR).getFullYear()}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-gray-500">No subjects available.</p>
                )}
            </div>
        </div>
    );
}
