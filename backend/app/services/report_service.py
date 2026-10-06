from datetime import datetime


def generate_report(result: dict):
    """
    Generate a simple text analysis report.
    """

    lines = []

    lines.append("=" * 70)
    lines.append("SECURE CODE DEBUGGING ASSISTANT")
    lines.append("CODE ANALYSIS REPORT")
    lines.append("=" * 70)

    lines.append("")
    lines.append(
        f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    )

    lines.append(
        f"Language: {result.get('language', 'Unknown')}"
    )

    lines.append(
        f"Code Score: {result.get('score', 0)}/100"
    )

    lines.append("")
    lines.append("-" * 70)
    lines.append("SUMMARY")
    lines.append("-" * 70)

    summary = result.get("summary", {})

    lines.append(
        f"Total Issues : {summary.get('total', 0)}"
    )

    lines.append(
        f"Potential Bugs : {summary.get('bugs', 0)}"
    )

    lines.append(
        f"Security Issues : {summary.get('security', 0)}"
    )

    lines.append(
        f"Quality Issues : {summary.get('quality', 0)}"
    )

    lines.append(
        f"MISRA Issues : {summary.get('misra', 0)}"
    )

    lines.append("")
    lines.append("-" * 70)
    lines.append("DETECTED ISSUES")
    lines.append("-" * 70)

    issues = result.get("issues", [])

    if not issues:
        lines.append("")
        lines.append("No issues detected.")

    else:

        for index, issue in enumerate(issues, start=1):

            lines.append("")
            lines.append(f"Issue #{index}")
            lines.append(
                f"Severity    : {issue.get('severity', 'Unknown')}"
            )
            lines.append(
                f"Type        : {issue.get('type', 'Unknown')}"
            )
            lines.append(
                f"Title       : {issue.get('title', 'Unknown')}"
            )
            lines.append(
                f"Line        : {issue.get('line', 'Unknown')}"
            )
            lines.append(
                f"Description : {issue.get('description', '')}"
            )
            lines.append(
                f"Suggestion  : {issue.get('suggestion', '')}"
            )

            lines.append("-" * 50)

    lines.append("")
    lines.append("=" * 70)
    lines.append(
        "Human review required for production decisions."
    )
    lines.append("=" * 70)

    return "\n".join(lines)