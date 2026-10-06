const API_BASE_URL = "http://127.0.0.1:8000";


// =========================================================
// ANALYZE CODE
// =========================================================

export const analyzeCode = async (code, language) => {
  const response = await fetch(
    `${API_BASE_URL}/api/analyze`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        code: code,
        language: language,
      }),
    }
  );


  if (!response.ok) {
    let message = "Unable to analyze the code.";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : "Invalid analysis request.";
      }

    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }


  const data = await response.json();


  /*
    Backend response is expected to be:

    {
      success: true,
      result: {
        language,
        score,
        summary,
        issues
      }
    }

    If result is already returned directly,
    this also handles that format.
  */

  return data.result || data;
};


// =========================================================
// DOWNLOAD REPORT
// =========================================================

export const downloadReport = async (result) => {
  const response = await fetch(
    `${API_BASE_URL}/api/report`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        result: result,
      }),
    }
  );


  if (!response.ok) {
    let message = "Unable to generate report.";

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message =
          typeof errorData.detail === "string"
            ? errorData.detail
            : "Report generation failed.";
      }

    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }


  // Convert server response to downloadable file

  const blob = await response.blob();


  // Create temporary browser URL

  const url = window.URL.createObjectURL(blob);


  // Create download link

  const link = document.createElement("a");

  link.href = url;

  link.download = "code-analysis-report.txt";


  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);


  // Clean temporary URL

  window.URL.revokeObjectURL(url);
};