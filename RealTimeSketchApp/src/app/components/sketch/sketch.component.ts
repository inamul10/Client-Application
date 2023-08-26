import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Component({
  selector: 'app-sketch',
  templateUrl: './sketch.component.html',
  styleUrls: ['./sketch.component.css']
})
export class SketchComponent implements AfterViewInit {

  @ViewChild('canvas') canvas!: ElementRef;
  private context!: CanvasRenderingContext2D;
  private socket!: Socket;

  private drawing = false;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  ngAfterViewInit(): void {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.socket.on('draw', (data: any) => {
      this.drawReceivedMark(data.lastX, data.lastY, data.x, data.y);
    });
  }

  onCanvasMouseDown(event: MouseEvent): void {
    this.drawing = true;
    this.lastX = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
    this.lastY = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

    this.context.beginPath(); // Start a new path
    this.context.moveTo(this.lastX, this.lastY); // Move the pen to the starting point
  }

  onCanvasMouseMove(event: MouseEvent): void {
    if (!this.drawing) return;

    const x = event.clientX - this.canvas.nativeElement.getBoundingClientRect().left;
    const y = event.clientY - this.canvas.nativeElement.getBoundingClientRect().top;

    this.drawMark(x, y);
    this.socket.emit('draw', { lastX: this.lastX, lastY: this.lastY, x, y }); // Emit the drawing data to the server

    this.lastX = x;
    this.lastY = y;
  }

  onCanvasMouseUp(): void {
    this.drawing = false;
  }

  private drawMark(x: number, y: number): void {
    if (!this.context) return;
    this.context.lineTo(x, y);
    this.context.stroke();
  }

  private drawReceivedMark(lastX: number, lastY: number, x: number, y: number): void {
    if (!this.context) return;

    this.context.beginPath();
    this.context.moveTo(lastX, lastY); // Move the pen to the last point
    this.context.lineTo(x, y); // Draw to the new point
    this.context.stroke();

    // Update the last point to the new point
    this.lastX = x;
    this.lastY = y;
  }
}
