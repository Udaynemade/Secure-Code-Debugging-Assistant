import { useState } from "react";
import "./App.css";

import {
  analyzeCode,
  downloadReport,
} from "./services/api";


function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("C++");

  const [analyzing, setAnalyzing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [result, setResult] = useState(null);

  // =========================================================
  // ISSUE FILTER STATES
  // =========================================================

  const [issueSearch, setIssueSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");


  // =========================================================
  // SAMPLE CODE
  // =========================================================

  const examples = {

    C: `#include <stdio.h>
#include <string.h>

int main() {

    char buffer[10];
    char name[20];

    gets(buffer);

    strcpy(name, buffer);

    printf("%s", name);

    return 0;
}`,

    "C++": `#include <iostream>
#include <cstring>

using namespace std;

int main() {

    char buffer[10];
    char name[20];

    gets(buffer);

    strcpy(name, buffer);

    cout << name << endl;

    return 0;
}`,

    Python: `import os

password = "admin123"

user_input = input("Enter command: ")

eval(user_input)

os.system(user_input)`,

    Java: `import java.sql.*;

public class Main {

    public static void main(String[] args) {

        String username = "admin";
        String password = "admin123";

        String userInput = "admin";

        String query =
            "SELECT * FROM users WHERE name = '" + userInput + "'";

        System.out.println(query);
    }
}`,

    JavaScript: `const password = "admin123";

const userInput = document
    .getElementById("input")
    .value;

eval(userInput);

document.getElementById("output").innerHTML = userInput;

console.log("Debug information:", password);`,
  };


  // =========================================================
  // LOAD EXAMPLE
  // =========================================================

  const handleLoadExample = () => {

    setCode(examples[language] || "");
    setResult(null);

    // Reset filters
    setIssueSearch("");
    setSeverityFilter("All");
  };


  // =========================================================
  // LANGUAGE CHANGE
  // =========================================================

  const handleLanguageChange = (event) => {

    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);
    setResult(null);

    // Reset filters
    setIssueSearch("");
    setSeverityFilter("All");
  };


  // =========================================================
  // CLEAR CODE
  // =========================================================

  const handleClear = () => {

    setCode("");
    setResult(null);

    // Reset filters
    setIssueSearch("");
    setSeverityFilter("All");
  };


  // =========================================================
  // ANALYZE CODE
  // =========================================================

  const handleAnalyze = async () => {

    if (!code.trim()) {

      alert("Please enter some code first.");

      return;
    }

    try {

      setAnalyzing(true);
      setResult(null);

      // Reset filters before new analysis
      setIssueSearch("");
      setSeverityFilter("All");

      const analysisResult = await analyzeCode(
        code,
        language
      );

      setResult(analysisResult);

    } catch (error) {

      console.error("Analysis Error:", error);

      alert(
        error.message ||
        "Unable to connect to the analysis server."
      );

    } finally {

      setAnalyzing(false);

    }
  };


  // =========================================================
  // DOWNLOAD REPORT
  // =========================================================

  const handleDownloadReport = async () => {

    if (!result) {

      alert("Please analyze your code first.");

      return;
    }

    try {

      setDownloading(true);

      await downloadReport(result);

    } catch (error) {

      console.error("Report Error:", error);

      alert(
        error.message ||
        "Unable to generate the report."
      );

    } finally {

      setDownloading(false);

    }
  };


  // =========================================================
  // SEVERITY CLASS
  // =========================================================

  const getSeverityClass = (severity) => {

    if (!severity) {
      return "low";
    }

    return severity.toLowerCase();

  };


  // =========================================================
  // FILTER ISSUES
  // =========================================================

  const filteredIssues =
    result?.issues?.filter((issue) => {

      // Severity filter
      const matchesSeverity =
        severityFilter === "All" ||
        issue.severity?.toLowerCase() ===
          severityFilter.toLowerCase();


      // Search filter
      const searchText =
        issueSearch.trim().toLowerCase();


      const matchesSearch =
        !searchText ||
        issue.title?.toLowerCase().includes(searchText) ||
        issue.description?.toLowerCase().includes(searchText) ||
        issue.type?.toLowerCase().includes(searchText);


      return matchesSeverity && matchesSearch;

    }) || [];


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="app">


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">
            🔐
          </div>

          <div>

            <h1>
              Secure Code Debugging Assistant
            </h1>

            <p>
              AI-Powered Automotive Code Review
            </p>

          </div>

        </div>


        <div className="status">

          <span className="status-dot"></span>

          System Ready

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="container">


        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero">

          <h2>
            Analyze Your Code
          </h2>

          <p>
            Detect bugs, security vulnerabilities,
            code quality issues, and MISRA-oriented
            problems in your source code.
          </p>

        </section>


        {/* ===================================================
            CODE INPUT
        =================================================== */}

        <section className="code-card">


          {/* TOOLBAR */}

          <div className="toolbar">

            <div>

              <label htmlFor="language">
                Programming Language
              </label>


              <select
                id="language"
                value={language}
                onChange={handleLanguageChange}
              >

                <option value="C">
                  C
                </option>

                <option value="C++">
                  C++
                </option>

                <option value="Python">
                  Python
                </option>

                <option value="Java">
                  Java
                </option>

                <option value="JavaScript">
                  JavaScript
                </option>

              </select>

            </div>


            <div className="file-status">
              Source Code
            </div>

          </div>


          {/* =================================================
              EDITOR ACTIONS
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "12px",
              gap: "10px",
            }}
          >

            {/* LOAD EXAMPLE */}

            <button
              type="button"
              onClick={handleLoadExample}
              style={{
                padding: "9px 14px",
                borderRadius: "7px",
                border:
                  "1px solid rgba(59, 130, 246, 0.35)",
                background:
                  "rgba(37, 99, 235, 0.10)",
                color: "#cfe2ff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              🧪 Load Example
            </button>


            {/* CLEAR */}

            <button
              type="button"
              onClick={handleClear}
              style={{
                padding: "9px 14px",
                borderRadius: "7px",
                border:
                  "1px solid rgba(148, 163, 184, 0.25)",
                background:
                  "rgba(148, 163, 184, 0.08)",
                color: "#aebed1",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              🗑️ Clear
            </button>

          </div>


          {/* =================================================
              CODE EDITOR
          ================================================= */}

          <textarea
            className="code-editor"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            placeholder={`Paste your ${language} code here...

Example:

${examples[language] || ""}
`}
            spellCheck="false"
          />


          {/* =================================================
              CODE INFO
          ================================================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "15px",
              fontSize: "12px",
              color: "#71849c",
            }}
          >

            <span>

              Language:

              <strong
                style={{
                  color: "#b9d4f5",
                  marginLeft: "4px",
                }}
              >
                {language}
              </strong>

            </span>


            <span>

              Lines:{" "}

              {code
                ? code.split("\n").length
                : 0}

            </span>

          </div>


          {/* =================================================
              ANALYZE BUTTON
          ================================================= */}

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={analyzing}
          >

            {analyzing
              ? "⏳ Analyzing Code..."
              : "🔍 Analyze Code"}

          </button>

        </section>


        {/* ===================================================
            RESULTS
        =================================================== */}

        {result && (

          <section className="results">


            {/* =================================================
                RESULTS HEADER
            ================================================= */}

            <div className="results-header">

              <div>

                <h2>
                  Analysis Results
                </h2>

                <p>
                  Automated security and code
                  quality assessment
                </p>


                {/* DOWNLOAD REPORT */}

                <button
                  className="download-report-btn"
                  onClick={handleDownloadReport}
                  disabled={downloading}
                >

                  {downloading
                    ? "⏳ Generating Report..."
                    : "📥 Download Report"}

                </button>

              </div>


              {/* SCORE */}

              <div className="score">

                <span>
                  {result.score ?? 0}
                </span>

                <small>
                  /100
                </small>

                <label>
                  Code Score
                </label>

              </div>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="summary-grid">


              {/* BUGS */}

              <div className="summary-card danger">

                <span className="summary-icon">
                  🐞
                </span>

                <div>

                  <strong>
                    {result.summary?.bugs ?? 0}
                  </strong>

                  <p>
                    Potential Bugs
                  </p>

                </div>

              </div>


              {/* SECURITY */}

              <div className="summary-card security">

                <span className="summary-icon">
                  🛡️
                </span>

                <div>

                  <strong>
                    {result.summary?.security ?? 0}
                  </strong>

                  <p>
                    Security Issues
                  </p>

                </div>

              </div>


              {/* QUALITY */}

              <div className="summary-card warning">

                <span className="summary-icon">
                  ⚠️
                </span>

                <div>

                  <strong>
                    {result.summary?.quality ?? 0}
                  </strong>

                  <p>
                    Quality Issues
                  </p>

                </div>

              </div>


              {/* MISRA */}

              <div className="summary-card info">

                <span className="summary-icon">
                  📋
                </span>

                <div>

                  <strong>
                    {result.summary?.misra ?? 0}
                  </strong>

                  <p>
                    MISRA Issues
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                DETECTED ISSUES
            ================================================= */}

            <div className="issue-section">

              <h3>
                Detected Issues
              </h3>


              {/* =================================================
                  SEARCH + FILTER
              ================================================= */}

              {result.issues &&
                result.issues.length > 0 && (

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "22px",
                      marginTop: "18px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >

                    {/* SEARCH */}

                    <input
                      type="text"
                      value={issueSearch}
                      onChange={(e) =>
                        setIssueSearch(
                          e.target.value
                        )
                      }
                      placeholder="🔎 Search issues..."
                      style={{
                        flex: "1",
                        minWidth: "240px",
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border:
                          "1px solid #26364a",
                        background:
                          "#0b1422",
                        color: "#dce9f8",
                        outline: "none",
                        fontSize: "13px",
                      }}
                    />


                    {/* SEVERITY */}

                    <select
                      value={severityFilter}
                      onChange={(e) =>
                        setSeverityFilter(
                          e.target.value
                        )
                      }
                      style={{
                        padding: "12px 14px",
                        borderRadius: "8px",
                        border:
                          "1px solid #26364a",
                        background:
                          "#0b1422",
                        color: "#dce9f8",
                        cursor: "pointer",
                        fontSize: "13px",
                        minWidth: "160px",
                      }}
                    >

                      <option value="All">
                        All Severities
                      </option>

                      <option value="Critical">
                        Critical
                      </option>

                      <option value="High">
                        High
                      </option>

                      <option value="Medium">
                        Medium
                      </option>

                      <option value="Low">
                        Low
                      </option>

                    </select>


                    {/* CLEAR FILTER */}

                    {(issueSearch ||
                      severityFilter !== "All") && (

                      <button
                        type="button"
                        onClick={() => {
                          setIssueSearch("");
                          setSeverityFilter("All");
                        }}
                        style={{
                          padding:
                            "11px 14px",
                          borderRadius: "8px",
                          border:
                            "1px solid rgba(148, 163, 184, 0.25)",
                          background:
                            "rgba(148, 163, 184, 0.08)",
                          color: "#aebed1",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        ✕ Clear Filter
                      </button>

                    )}

                  </div>

                )}


              {/* =================================================
                  FILTER RESULT COUNT
              ================================================= */}

              {result.issues &&
                result.issues.length > 0 && (

                  <div
                    style={{
                      marginBottom: "18px",
                      color: "#71849c",
                      fontSize: "12px",
                    }}
                  >

                    Showing{" "}

                    <strong
                      style={{
                        color: "#cfe2ff",
                      }}
                    >
                      {filteredIssues.length}
                    </strong>

                    {" "}of{" "}

                    <strong
                      style={{
                        color: "#cfe2ff",
                      }}
                    >
                      {result.issues.length}
                    </strong>

                    {" "}issues

                  </div>

                )}


              {/* =================================================
                  NO ISSUES
              ================================================= */}

              {!result.issues ||
              result.issues.length === 0 ? (

                <div className="no-issues">

                  <div className="success-icon">
                    ✅
                  </div>

                  <h4>
                    No Issues Detected
                  </h4>

                  <p>
                    The submitted code passed the
                    configured security, quality,
                    and MISRA-oriented checks.
                  </p>

                </div>

              ) : filteredIssues.length === 0 ? (

                /* =================================================
                   NO FILTER RESULTS
                ================================================= */

                <div className="no-issues">

                  <div className="success-icon">
                    🔎
                  </div>

                  <h4>
                    No Matching Issues
                  </h4>

                  <p>
                    No issues match the current
                    search or severity filter.
                    Try changing the filter.
                  </p>

                </div>

              ) : (

                /* =================================================
                   FILTERED ISSUES
                ================================================= */

                filteredIssues.map(
                  (issue, index) => (

                    <div
                      className="issue"
                      key={`${issue.line}-${index}`}
                    >


                      {/* TITLE */}

                      <div className="issue-title">

                        <span
                          className={`severity ${getSeverityClass(
                            issue.severity
                          )}`}
                        >

                          {issue.severity?.toUpperCase() ||
                            "UNKNOWN"}

                        </span>


                        <h4>
                          {issue.title}
                        </h4>

                      </div>


                      {/* DESCRIPTION */}

                      <p>
                        {issue.description}
                      </p>


                      {/* META */}

                      <div className="issue-meta">

                        <span>
                          📍 Line {issue.line}
                        </span>

                        <span>
                          🏷️ {issue.type}
                        </span>

                      </div>


                      {/* SUGGESTION */}

                      {issue.suggestion && (

                        <div className="suggestion-inline">

                          <strong>
                            💡 Suggested Fix:
                          </strong>

                          <span>
                            {issue.suggestion}
                          </span>

                        </div>

                      )}

                    </div>

                  )

                )

              )}

            </div>


            {/* =================================================
                RECOMMENDED FIXES
            ================================================= */}

            {result.issues &&
              result.issues.length > 0 && (

                <div className="fix-section">

                  <div className="fix-header">

                    <h3>
                      💡 Recommended Fixes
                    </h3>

                  </div>


                  <p>
                    Review the following
                    recommendations to improve
                    security and code quality.
                  </p>


                  {/* FILTERED FIX COUNT */}

                  <div
                    style={{
                      marginTop: "12px",
                      marginBottom: "8px",
                      color: "#71849c",
                      fontSize: "12px",
                    }}
                  >

                    Showing fixes for{" "}

                    <strong
                      style={{
                        color: "#cfe2ff",
                      }}
                    >
                      {filteredIssues.length}
                    </strong>

                    {" "}issues

                  </div>


                  <div className="fixed-code">

                    {filteredIssues.map(
                      (issue, index) => (

                        <div
                          key={index}
                          className="fix-item"
                        >

                          <div className="fix-item-header">

                            <span
                              className={`severity ${getSeverityClass(
                                issue.severity
                              )}`}
                            >

                              {issue.severity?.toUpperCase() ||
                                "UNKNOWN"}

                            </span>


                            <strong>
                              {issue.title}
                            </strong>

                          </div>


                          <p>
                            {issue.suggestion ||
                              "Review this issue and apply an appropriate fix."}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

          </section>

        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer>

        <p>
          Secure Code Debugging Assistant
          {" • "}
          Automotive Engineering AI
        </p>

        <span>
          Human review required for production decisions
        </span>

      </footer>

    </div>
  );
}


export default App;