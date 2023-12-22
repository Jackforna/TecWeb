import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit{

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    console.log("Siamo monitoring.component.ts");
  }

}

