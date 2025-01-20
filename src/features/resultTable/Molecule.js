import parse, { attributesToProps, domToReact } from "html-react-parser"
import PropTypes from "prop-types"
import React, { useCallback, useEffect, useState } from "react"

export default function Molecule({
    molId,
    svgValue,
    selectedAtom,
    onSelectAtom,
}) {
    const [svg, setSvg] = useState(null)

    //
    // we dynamically add (and remove) a class to the correct atom when selected
    //
    const ref = useCallback(
        (ref) => {
            if (
                ref?.current !== undefined &&
                selectedAtom !== undefined &&
                svg !== null
            ) {
                const atoms = ref.current.querySelectorAll(
                    `.atom-${selectedAtom}`,
                )
                atoms.forEach((atom) => {
                    atom.classList.add("selected")
                })

                return () => {
                    atoms.forEach((atom) => {
                        atom.classList.remove("selected")
                    })
                }
            }
        },
        [selectedAtom, svg],
    )

    //
    // to improve performance, we render the SVG only once
    //
    useEffect(() => {
        const parseOptions = {
            replace: (domNode) => {
                if (domNode === undefined) {
                    return
                }

                if (domNode.name === "svg") {
                    const updatedAttribs = {
                        ...domNode.attribs,
                        className: "molecule",
                    }

                    return (
                        <svg ref={ref} {...attributesToProps(updatedAttribs)}>
                            {domToReact(domNode.children, parseOptions)}
                        </svg>
                    )
                } else if (
                    domNode.name === "ellipse" &&
                    domNode.attribs &&
                    domNode.attribs.class !== undefined &&
                    domNode.attribs.class.startsWith("atom")
                ) {
                    const updatedAttribs = {
                        ...domNode.attribs,
                    }

                    const atomId = parseInt(
                        domNode.attribs.class.replace("atom-", ""),
                    )

                    return (
                        <ellipse
                            {...attributesToProps(updatedAttribs)}
                            onMouseEnter={
                                onSelectAtom
                                    ? (e) => onSelectAtom(e, molId, atomId)
                                    : null
                            }
                            onMouseOut={
                                onSelectAtom
                                    ? (e) => onSelectAtom(e, molId, atomId)
                                    : null
                            }
                        />
                    )
                }
            },
        }

        if (svgValue.startsWith("<svg")) {
            const svg = parse(svgValue, parseOptions)
            setSvg(svg)
        } else {
            // svgValue is a URL pointing to an svg file
            fetch(svgValue)
                .then((response) => response.text())
                .then((text) => {
                    const svg = parse(text, parseOptions)
                    setSvg(svg)
                })
        }
    }, [molId, onSelectAtom])

    return svg
}

Molecule.propTypes = {
    molId: PropTypes.number.isRequired,
    svgValue: PropTypes.string.isRequired,
    selectedAtom: PropTypes.number,
    onSelectAtom: PropTypes.func,
}
