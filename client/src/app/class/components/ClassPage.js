"use client";
import React, { useEffect, useState } from "react";
import "./class.css";
import CreateClass from "./CreateClass.js";
import ViewClass from "./ViewClass.js";

export default function ClassPage() {
	return (
		<div className="body">
			<h1 className="title">Classes</h1>

			<CreateClass></CreateClass>
			<ViewClass></ViewClass>
		</div>
	);
}
