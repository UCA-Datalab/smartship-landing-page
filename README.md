<!-- README template: https://github.com/othneildrew/Best-README-Template -->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
<!-- [![Contributors][contributors-shield]][contributors-url] -->
<!-- [![Forks][forks-shield]][forks-url] -->
<!-- [![Stargazers][stars-shield]][stars-url] -->
<!-- [![Issues][issues-shield]][issues-url] -->

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/UCA-Datalab">
    <img src="img/logo.png" alt="Logo" width="400" height="80">
  </a>

  <h3 align="center">SMART SHIPPING 2021</h3>
</p>


<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#create-the-environment">Create the Environment</a></li>
      </ul>
    </li>
     <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

## About the Project

Web application for a Weather Routing implementation, implemented in [https://github.com/UCA-Datalab/smart-shipping-2021](https://github.com/UCA-Datalab/smart-shipping-2021)

## Getting Started

### Create the environment

To create the Python environment using Conda:

  1. Install miniconda
     
     ```
     curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh | bash
     ```

     Say yes to everything and accept default locations. Refresh bash shell with `bash -l`

  2. Update conda
     
      ```
      conda update -n base -c defaults conda
      ```

  3. Clone this repository and cd into the folder

  4. Create and activate conda environment (removing previously existing env of the same name)
     
       ```
       conda remove --name smartship-web --all
       conda env create -f environment.yml --force
       conda activate smartship-web
       ```

To create the Javascript project with `npm`:
  1. Make sure you have installed `npm`
      Instructions: [link](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
      
  2. Move to static folder
      ```
      cd static
      ```

  3. Install the packages
      ```
      npm install
      ```

## Contact

David Gómez-Ullate - [dgullate](https://github.com/dgullate) -  david.gomezullate@uca.es

Project link: [https://github.com/UCA-Datalab/Smartship-web-app](https://github.com/UCA-Datalab/Smartship-web-app)

## Acknowledgements

* [UCA DataLab](http://datalab.uca.es/)
* [Daniel Precioso](https://www.linkedin.com/in/daniel-precioso-garcelan/)
* [Javier Jiménez de la Jara](https://github.com/UCA-Datalab/Smartship-web-app/commits?author=Javier-Jimenez99)
* [Francisco Amor](https://www.linkedin.com/in/francisco-amor-97b27820b/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/UCA-Datalab/smart-shipping-2021.svg?style=for-the-badge
[contributors-url]: https://github.com/UCA-Datalab/Smartship-web-app/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/UCA-Datalab/smart-shipping-2021.svg?style=for-the-badge
[forks-url]: https://github.com/UCA-Datalab/Smartship-web-app/network/members
[stars-shield]: https://img.shields.io/github/stars/UCA-Datalab/smart-shipping-2021.svg?style=for-the-badge
[stars-url]: https://github.com/UCA-Datalab/Smartship-web-app/stargazers
[issues-shield]: https://img.shields.io/github/issues/UCA-Datalab/smart-shipping-2021.svg?style=for-the-badge
[issues-url]: https://github.com/UCA-Datalab/Smartship-web-app/issues