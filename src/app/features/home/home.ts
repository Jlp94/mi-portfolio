import { Component } from '@angular/core';
import { Navbar } from '../../shared/layouts/navbar/navbar';
import { Footer } from '../../shared/layouts/footer/footer';
import { Hero } from '../components/hero/hero';
import { AboutMe } from '../components/about-me/about-me';
import { Stack } from '../components/stack/stack';
import { Experience } from '../components/experience/experience';
import { Education } from '../components/education/education';
import { Projects } from '../components/projects/projects';
import { Contact } from '../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [
    Navbar,
    Hero,
    AboutMe,
    Stack,
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
