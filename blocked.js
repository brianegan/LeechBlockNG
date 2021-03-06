/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Processes info for blocking/delaying page
//
function processBlockInfo(info) {
	if (!info) return;

	let blockedURL = document.getElementById("leechblockBlockedURL");
	if (info.blockedURL && blockedURL) {
		if (info.blockedURL.length > 60) {
			blockedURL.innerText = info.blockedURL.substring(0, 57) + "...";
		} else {
			blockedURL.innerText = info.blockedURL;
		}
	}

	let blockedURLLink = document.getElementById("leechblockBlockedURLLink");
	if (info.blockedURL && blockedURLLink) {
		blockedURLLink.setAttribute("href", info.blockedURL);
	}

	let blockedSet = document.getElementById("leechblockBlockedSet");
	if (info.blockedSet && info.blockedSetName && blockedSet) {
		if (info.blockedSetName != "") {
			blockedSet.innerText = info.blockedSetName;
		} else {
			blockedSet.innerText += " " + info.blockedSet;
		}
	}

	let unblockTime = document.getElementById("leechblockUnblockTime");
	if (info.unblockTime && unblockTime) {
		unblockTime.innerText = info.unblockTime;
	}

	let delaySecs = document.getElementById("leechblockDelaySeconds");
	if (info.delaySecs && delaySecs) {
		delaySecs.innerText = info.delaySecs;

		// Start countdown timer
		let countdown = {
			blockedURL: info.blockedURL,
			blockedSet: info.blockedSet,
			delaySecs: info.delaySecs
		};
		countdown.interval = window.setInterval(onCountdownTimer, 1000, countdown);
	}
}

// Handle countdown on delaying page
//
function onCountdownTimer(countdown) {
	// Cancel countdown if document not focused
	if (!document.hasFocus()) {
		// Clear countdown timer
		window.clearInterval(countdown.interval);

		// Strike through countdown text
		let countdownText = document.getElementById("leechblockCountdownText");
		if (countdownText) {
			countdownText.style.textDecoration = "line-through";
		}

		return;
	}

	countdown.delaySecs--;

	// Update countdown seconds on page
	let delaySecs = document.getElementById("leechblockDelaySeconds");
	if (delaySecs) {
		delaySecs.innerText = countdown.delaySecs;
	}

	if (countdown.delaySecs == 0) {
		// Clear countdown timer
		window.clearInterval(countdown.interval);

		// Request extension allow blocked page and redirect
		let message = {
			type: "delayed",
			blockedURL: countdown.blockedURL,
			blockedSet: countdown.blockedSet
		};
		browser.runtime.sendMessage(message);
	}
}

// Request block info from extension
browser.runtime.sendMessage({ type: "blocked" }).then(processBlockInfo);
