import { Component } from '@angular/core';
import { Navbar } from '../../shared/layouts/navbar/navbar';
import { Footer } from '../../shared/layouts/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutStack } from '../components/about-stack/about-stack';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Projects } from '../components/projects/projects';
import { Contact } from '../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    Hero,
    AboutStack,
    Experience,
    Education,
    Projects,
    Contact,
    Footer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
