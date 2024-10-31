import React, { useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { makeButton, useTweaks } from "use-tweaks"
import Icon from "../icon/Icon"
import { setCollapse } from "./tweakPanelSlice"

export default function TweakPanel() {
    const dispatch = useDispatch()

    const collapse = useSelector((state) => state.tweakPanel.collapse)

    const containerRef = useRef()

    useTweaks(
        "TweakPanel",
        {
            ...makeButton("Collapse", () => dispatch(setCollapse(true))),
        },
        {
            container: containerRef,
        },
    )

    return (
        <>
            <div
                className={`${collapse ? "d-none" : ""} position-fixed top-0 end-0 z-3 m-2`}
                style={{ width: "256px" }}
                ref={containerRef}
            ></div>
            <button
                className={`${collapse ? "" : "d-none"} btn position-fixed top-0 end-0 z-3 m-2 text-body-secondary`}
                onClick={() => dispatch(setCollapse(false))}
            >
                <Icon name="FaGear" size={20} />
            </button>
        </>
    )
}