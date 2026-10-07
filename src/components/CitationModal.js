import {createElement, useEffect, useState} from "npm:react";
import {faCheck} from "npm:@fortawesome/free-solid-svg-icons/faCheck";
import {faCopy} from "npm:@fortawesome/free-solid-svg-icons/faCopy";

export function CitationModal({id, stationName, citationRecord, onClose}) {
  const [copyLabel, setCopyLabel] = useState("Copy citation");
  const [isCopyResetting, setIsCopyResetting] = useState(false);
  const copyIcon = copyLabel === "Citation copied" ? faCheck : faCopy;
  const [copyIconWidth, copyIconHeight, , , copyIconPath] = copyIcon.icon;

  useEffect(() => {
    if (copyLabel !== "Citation copied") return undefined;
    const resetTimer = setTimeout(() => {
      setIsCopyResetting(true);
      setCopyLabel("Copy citation");
    }, 2000);
    return () => clearTimeout(resetTimer);
  }, [copyLabel]);

  useEffect(() => {
    if (!isCopyResetting) return undefined;
    const resetAnimationTimer = setTimeout(() => setIsCopyResetting(false), 500);
    return () => clearTimeout(resetAnimationTimer);
  }, [isCopyResetting]);

  const copyCitation = async () => {
    setIsCopyResetting(false);
    if (!citationRecord?.citation || !navigator.clipboard?.writeText) {
      setCopyLabel("Copy unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(citationRecord.citation);
      setCopyLabel("Citation copied");
    } catch {
      setCopyLabel("Copy unavailable");
    }
  };

  return createElement(
    "div",
    {className: "climatology-card__citation-modal"},
    createElement("button", {
      type: "button",
      className: "climatology-card__citation-backdrop",
      "aria-label": "Close citation",
      onClick: onClose
    }),
    createElement(
      "section",
      {
        id,
        className: "climatology-card__citation-popup",
        role: "dialog",
        "aria-modal": true,
        "aria-label": `Citation for ${stationName}`
      },
      createElement(
        "button",
        {
          type: "button",
          className: "climatology-card__citation-close",
          "aria-label": "Close citation",
          onClick: onClose
        },
        "×"
      ),
      citationRecord
        ? createElement(
            "div",
            {className: "climatology-card__citation-content"},
            createElement("p", {className: "climatology-card__citation-dataset"}, citationRecord.dataset_title),
            createElement("p", {className: "climatology-card__citation-label"}, "Data citation"),
            createElement(
              "p",
              {className: "climatology-card__citation-text"},
              citationRecord.citation,
              createElement(
                "button",
                {
                  type: "button",
                  className: `climatology-card__citation-copy${copyLabel === "Citation copied" ? " is-copied" : isCopyResetting ? " is-resetting" : ""}`,
                  "aria-label": copyLabel,
                  title: copyLabel,
                  onClick: copyCitation
                },
                createElement(
                  "svg",
                  {
                    viewBox: `0 0 ${copyIconWidth} ${copyIconHeight}`,
                    "aria-hidden": true,
                    focusable: "false"
                  },
                  createElement("path", {d: copyIconPath})
                )
              )
            ),
            createElement(
              "div",
              {className: "climatology-card__citation-actions"},
              createElement(
                "a",
                {
                  className: "climatology-card__citation-link",
                  href: citationRecord.dataset_url,
                  target: "_blank",
                  rel: "noreferrer"
                },
                "View metadata"
              )
            )
          )
        : createElement(
            "p",
            {className: "climatology-card__citation-text"},
            `A citation is not yet available for ${stationName}.`
          )
    )
  );
}
