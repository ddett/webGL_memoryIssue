import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import mapboxgl from "mapbox-gl";

import "./main.html";

const _isShowMap = new ReactiveVar(true);
const _timesLoaded = new ReactiveVar(1);
const _timesReceivedMemoryWarning = new ReactiveVar(0);
const _isUIWebView = new ReactiveVar(false);
const _isWKWebView = new ReactiveVar(false);
mapboxgl.accessToken = "pk.eyJ1Ijoid2ViZ2wtbWVtb3J5aXNzdWUiLCJhIjoiY2pwNGpzdXI1MG00eTNrcHh5MjFoNDh1MCJ9.uVEfXDntzGURpMW1cEZvOA";
const waitTime = 5000;

Template.autoMapLoader.onRendered(function(){
	if (Meteor.isCordova) {
		window.addEventListener("cordova-plugin-memory-alert.memoryWarning",
			function () {
		    	_timesReceivedMemoryWarning.set(_timesReceivedMemoryWarning.get() + 1);
			}
		);
		cordova.plugins.CordovaPluginMemoryAlert.activate(true);
	}

	Meteor.setInterval(() => {
		_isShowMap.set(!_isShowMap.get());
		if (_isShowMap.get()) {
			_timesLoaded.set(_timesLoaded.get() + 1);
		};
	}, waitTime);
});

Template.autoMapLoader.helpers({
	isShowMap : function() {
		return _isShowMap.get();
	}
});

Template.info.helpers({
	timesLoaded : function() {
		return _timesLoaded.get();
	},

	timesReceivedMemoryWarning : function() {
		return _timesReceivedMemoryWarning.get();
	},

	webViewEngine : function() {
		var isUIWebView = _isUIWebView.get();
		var isWKWebView = _isWKWebView.get();
		if (isUIWebView) {
			return "UIWebView";
		} else if (isWKWebView) {
			return "WKWebView";
		} else {
			return "undefined webViewEngine";
		}
	},

	intervalTime : function() {
		return waitTime;
	}
});

Template.info.onRendered(function() {
	if (Meteor.isCordova) {
		cordova.plugins.webviewEngine.isUIWebView().then(isUIWebView => {
			_isUIWebView.set(isUIWebView);
		});

		cordova.plugins.webviewEngine.isWKWebView().then(isWKWebView => {
			_isWKWebView.set(isWKWebView);
		});
	};
});

Template.map.onRendered(function() {
	var map = new mapboxgl.Map({
		container : "map",
		style: "mapbox://styles/mapbox/streets-v9", // stylesheet location
	    center: [-74.50, 40], // starting position [lng, lat]
	    zoom: 9 // starting zoom
	});
});