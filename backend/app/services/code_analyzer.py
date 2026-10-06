import re


# =========================================================
# COMMON ISSUE HELPER
# =========================================================

def add_issue(
    issues,
    issue_type,
    severity,
    title,
    line_number,
    description,
    suggestion,
):
    issues.append(
        {
            "type": issue_type,
            "severity": severity,
            "title": title,
            "line": line_number,
            "description": description,
            "suggestion": suggestion,
        }
    )


# =========================================================
# C / C++ ANALYZER
# =========================================================

def analyze_c_cpp(code, language):
    issues = []
    lines = code.splitlines()

    for line_number, line in enumerate(lines, start=1):

        if not line.strip():
            continue

        # gets()
        if re.search(r"\bgets\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Critical",
                "Unsafe Input Function",
                line_number,
                "gets() does not perform boundary checking and can cause a buffer overflow.",
                "Replace gets() with fgets() and specify the maximum buffer size.",
            )

        # strcpy()
        if re.search(r"\bstrcpy\s*\(", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Unsafe String Copy",
                line_number,
                "strcpy() does not verify destination buffer size and may cause buffer overflow.",
                "Use strncpy() or another bounded string operation.",
            )

        # strcat()
        if re.search(r"\bstrcat\s*\(", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Unsafe String Concatenation",
                line_number,
                "strcat() may write beyond the destination buffer.",
                "Use a bounded concatenation method and validate buffer size.",
            )

        # sprintf()
        if re.search(r"\bsprintf\s*\(", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Potential Format Buffer Overflow",
                line_number,
                "sprintf() can write beyond the destination buffer.",
                "Use snprintf() with the destination buffer size.",
            )

        # scanf()
        if re.search(r"\bscanf\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Medium",
                "Unbounded Input",
                line_number,
                "scanf() can create input validation and buffer safety risks.",
                "Use appropriate field widths or safer bounded input handling.",
            )

        # malloc()
        if re.search(r"\bmalloc\s*\(", line):
            add_issue(
                issues,
                "Bug",
                "Medium",
                "Dynamic Memory Allocation",
                line_number,
                "malloc() may fail and the allocated memory must be released.",
                "Check the returned pointer and call free() when appropriate.",
            )

        # goto
        if re.search(r"\bgoto\b", line):
            add_issue(
                issues,
                "MISRA",
                "Medium",
                "Goto Statement Detected",
                line_number,
                "goto can make control flow harder to understand and maintain.",
                "Prefer structured control flow such as loops, functions, or conditions.",
            )

        # using namespace std
        if re.search(r"\busing\s+namespace\s+std\s*;", line):
            add_issue(
                issues,
                "Quality",
                "Low",
                "Global Namespace Usage",
                line_number,
                "Global using-directives can introduce naming conflicts.",
                "Prefer explicit std:: qualification.",
            )

        # TODO / FIXME
        if "TODO" in line or "FIXME" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Pending Code Change",
                line_number,
                "The source contains a TODO or FIXME marker.",
                "Resolve the pending implementation before production use.",
            )

    # Brace check
    if code.count("{") != code.count("}"):
        add_issue(
            issues,
            "Bug",
            "High",
            "Unbalanced Braces",
            len(lines),
            "The number of opening and closing braces does not match.",
            "Check the source for missing or extra curly braces.",
        )

    return issues


# =========================================================
# PYTHON ANALYZER
# =========================================================

def analyze_python(code):
    issues = []
    lines = code.splitlines()

    for line_number, line in enumerate(lines, start=1):

        if not line.strip():
            continue

        # eval()
        if re.search(r"\beval\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Critical",
                "Dangerous eval() Usage",
                line_number,
                "eval() can execute dynamically supplied Python expressions.",
                "Avoid eval() and use safe parsing or explicit validation.",
            )

        # exec()
        if re.search(r"\bexec\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Critical",
                "Dangerous exec() Usage",
                line_number,
                "exec() can execute dynamically supplied Python code.",
                "Avoid exec() and use safer program logic.",
            )

        # os.system
        if re.search(r"\bos\.system\s*\(", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Operating System Command Execution",
                line_number,
                "os.system() executes commands through the operating system shell.",
                "Use safer subprocess handling with validated arguments.",
            )

        # subprocess shell=True
        if "subprocess" in line and "shell=True" in line:
            add_issue(
                issues,
                "Security",
                "High",
                "Shell Command Execution",
                line_number,
                "Using shell=True can increase command injection risk.",
                "Avoid shell=True and pass validated command arguments directly.",
            )

        # hardcoded password
        if re.search(
            r"(password|passwd|secret|api_key|apikey)\s*=",
            line,
            re.IGNORECASE,
        ):
            add_issue(
                issues,
                "Security",
                "High",
                "Possible Hardcoded Secret",
                line_number,
                "A possible password, secret, or API key is directly assigned in source code.",
                "Move secrets to environment variables or a secure secret manager.",
            )

        # TODO
        if "TODO" in line or "FIXME" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Pending Code Change",
                line_number,
                "The source contains a TODO or FIXME marker.",
                "Resolve the pending implementation before production use.",
            )

    return issues


# =========================================================
# JAVA ANALYZER
# =========================================================

def analyze_java(code):
    issues = []
    lines = code.splitlines()

    for line_number, line in enumerate(lines, start=1):

        if not line.strip():
            continue

        # Runtime.exec
        if re.search(r"\bRuntime\.getRuntime\(\)\.exec\s*\(", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Runtime Command Execution",
                line_number,
                "Runtime.exec() can execute operating system commands and may introduce command injection risks.",
                "Validate command arguments and avoid constructing commands from untrusted input.",
            )

        # SQL concatenation
        if re.search(
            r"(SELECT|INSERT|UPDATE|DELETE).*\".*\+",
            line,
            re.IGNORECASE,
        ):
            add_issue(
                issues,
                "Security",
                "High",
                "Possible SQL Injection",
                line_number,
                "SQL appears to be constructed through string concatenation.",
                "Use PreparedStatement with parameterized queries.",
            )

        # hardcoded secret
        if re.search(
            r"(password|secret|apiKey|api_key)\s*=",
            line,
            re.IGNORECASE,
        ):
            add_issue(
                issues,
                "Security",
                "High",
                "Possible Hardcoded Secret",
                line_number,
                "A possible credential or secret appears directly in source code.",
                "Store credentials securely outside the source code.",
            )

        # System.out
        if "System.out.println" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Console Output",
                line_number,
                "Direct console output may not be appropriate for production applications.",
                "Use an appropriate logging framework.",
            )

        # TODO
        if "TODO" in line or "FIXME" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Pending Code Change",
                line_number,
                "The source contains a TODO or FIXME marker.",
                "Resolve the pending implementation.",
            )

    return issues


# =========================================================
# JAVASCRIPT ANALYZER
# =========================================================

def analyze_javascript(code):
    issues = []
    lines = code.splitlines()

    for line_number, line in enumerate(lines, start=1):

        if not line.strip():
            continue

        # eval()
        if re.search(r"\beval\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Critical",
                "Dangerous eval() Usage",
                line_number,
                "eval() executes dynamically generated JavaScript code.",
                "Avoid eval() and use safer alternatives.",
            )

        # innerHTML
        if re.search(r"\.innerHTML\s*=", line):
            add_issue(
                issues,
                "Security",
                "High",
                "Potential DOM Injection",
                line_number,
                "Assigning untrusted content to innerHTML may introduce XSS vulnerabilities.",
                "Prefer textContent or safely sanitize HTML content.",
            )

        # document.write
        if re.search(r"\bdocument\.write\s*\(", line):
            add_issue(
                issues,
                "Security",
                "Medium",
                "Unsafe document.write() Usage",
                line_number,
                "document.write() can create injection risks when used with untrusted data.",
                "Use safer DOM APIs instead.",
            )

        # hardcoded secret
        if re.search(
            r"(password|secret|apiKey|api_key|token)\s*=",
            line,
            re.IGNORECASE,
        ):
            add_issue(
                issues,
                "Security",
                "High",
                "Possible Hardcoded Secret",
                line_number,
                "A possible secret or token appears directly in source code.",
                "Move secrets to secure environment configuration.",
            )

        # console.log
        if "console.log(" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Console Logging",
                line_number,
                "Console logging may expose information or remain in production code.",
                "Use a controlled logging mechanism or remove debug logging.",
            )

        # TODO
        if "TODO" in line or "FIXME" in line:
            add_issue(
                issues,
                "Quality",
                "Low",
                "Pending Code Change",
                line_number,
                "The source contains a TODO or FIXME marker.",
                "Resolve the pending implementation.",
            )

    return issues


# =========================================================
# MAIN ANALYZER
# =========================================================

def analyze_code(code: str, language: str = "C++"):

    normalized_language = language.strip().lower()

    # -----------------------------------------------------
    # SELECT LANGUAGE ANALYZER
    # -----------------------------------------------------

    if normalized_language == "c":
        issues = analyze_c_cpp(code, "C")

    elif normalized_language in ["c++", "cpp"]:
        issues = analyze_c_cpp(code, "C++")

    elif normalized_language == "python":
        issues = analyze_python(code)

    elif normalized_language == "java":
        issues = analyze_java(code)

    elif normalized_language in [
        "javascript",
        "js",
    ]:
        issues = analyze_javascript(code)

    else:
        issues = []

        add_issue(
            issues,
            "Quality",
            "Medium",
            "Unsupported Language",
            1,
            f"The language '{language}' is not currently supported.",
            "Select C, C++, Python, Java, or JavaScript.",
        )

    # -----------------------------------------------------
    # SCORE
    # -----------------------------------------------------

    score = 100

    penalties = {
        "Critical": 25,
        "High": 15,
        "Medium": 8,
        "Low": 3,
    }

    for issue in issues:
        score -= penalties.get(
            issue["severity"],
            0,
        )

    score = max(0, score)

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    summary = {
        "total": len(issues),

        "bugs": len(
            [
                issue
                for issue in issues
                if issue["type"] == "Bug"
            ]
        ),

        "security": len(
            [
                issue
                for issue in issues
                if issue["type"] == "Security"
            ]
        ),

        "quality": len(
            [
                issue
                for issue in issues
                if issue["type"] == "Quality"
            ]
        ),

        "misra": len(
            [
                issue
                for issue in issues
                if issue["type"] == "MISRA"
            ]
        ),
    }

    return {
        "language": language,
        "score": score,
        "summary": summary,
        "issues": issues,
    }