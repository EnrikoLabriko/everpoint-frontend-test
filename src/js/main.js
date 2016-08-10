'use strict';

function StopWatch(canvasContainer) {

  this.init = function() {
    this.setVariables(canvasContainer);
    this.renderControls(canvasContainer);
    this.renderCanvas(canvasContainer);
    this.renderWatch();
  };

  this.setVariables = function(canvasContainer) {
    var canvasContainerStyles = window.getComputedStyle(canvasContainer);
    var width = parseInt(canvasContainerStyles.width);
    var height = parseInt(canvasContainerStyles.height);

    if (width !== height) {  // В случае "неквадратности" исходного элемента, выбираем меньшую сторону
      this.sideSize = width < height ? width : height;
    } else {
      this.sideSize = width;
    }

    this.centerCoordinateX = this.sideSize / 2;
    this.centerCoordinateY = this.sideSize / 2;
    this.watchRadius = this.sideSize / 2 - 1; // Микроотступ, чтобы прорисовались места пересечения окружности с контейнером
    this.value = 0;
  };

  this.renderControls = function(canvasContainer) {
    var controlsContainer = document.createElement('div');
    var startControl = document.createElement('button');
    var pauseControl = document.createElement('button');
    var stopControl = document.createElement('button');
    var counter = document.createElement('div');

    startControl.innerHTML = 'Старт';
    pauseControl.innerHTML = 'Пауза';
    stopControl.innerHTML = 'Стоп';
    counter.innerHTML = this.value;

    startControl.setAttribute("id", "start");
    pauseControl.setAttribute("id", "pause");
    stopControl.setAttribute("id", "stop");
    counter.setAttribute("id", "counter");

    startControl.onclick = function() {
      stopWatch.start();
    };
    pauseControl.onclick = function() {
      stopWatch.pause();
    };
    stopControl.onclick = function() {
      stopWatch.stop();
    };

    controlsContainer.appendChild(startControl);
    controlsContainer.appendChild(pauseControl);
    controlsContainer.appendChild(stopControl);

    canvasContainer.appendChild(controlsContainer);
    canvasContainer.appendChild(counter);
  };

  this.renderCanvas = function(canvasContainer) {
    this.canvasDiv = document.createElement('canvas');
    this.canvasDiv.setAttribute("width", this.sideSize);
    this.canvasDiv.setAttribute("height", this.sideSize);
    this.canvasContext = this.canvasDiv.getContext('2d');
    this.canvasContext.strokeStyle = "#000000";

    canvasContainer.appendChild(this.canvasDiv);
  };

  this.renderWatch = function() {
    this.canvasContext.clearRect(0, 0, this.sideSize, this.sideSize);
    this.canvasContext.beginPath();
    this.canvasContext.arc(this.centerCoordinateX, this.centerCoordinateY, this.watchRadius, 0, Math.PI * 2, true);
    this.canvasContext.closePath();
    this.canvasContext.stroke();

    this.canvasContext.beginPath();
    this.canvasContext.lineTo(this.centerCoordinateX, this.centerCoordinateY);
    this.canvasContext.lineTo(
      this.centerCoordinateX + this.watchRadius * Math.cos(this.convertSecondsToRadians()),
      this.centerCoordinateY + this.watchRadius * Math.sin(this.convertSecondsToRadians())
    );
    this.canvasContext.closePath();
    this.canvasContext.stroke();

    this.updateCounter();
  };

  this.updateCounter = function() {
    document.getElementById('counter').innerHTML = this.value;
  };

  this.convertSecondsToRadians = function() {
    return Math.PI * ((360 / 60) * this.value - 90) / 180;
  };

  this.start = function() {
    if (this.watchTimer) return;

    this.watchTimer = setInterval((function() {
      this.value += 1;

      this.renderWatch(this.value % 60);
    }).bind(this), 1000);
  };

  this.pause = function() {
    clearInterval(this.watchTimer);
    this.watchTimer = null;
  };

  this.stop = function() {
    this.pause();
    this.value = 0;
    this.renderWatch(this.value);
  };
}


var stopWatch = new StopWatch(document.getElementById("watch-container"));

stopWatch.init();
