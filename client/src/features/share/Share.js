import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faEnvelope, faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

import './share.css';

const isUrl = require('is-valid-http-url');
const isImage = require('is-image');

export default function Share() {

  const profile = {
    id: "5f69f55dc9ba431048112e50",
    firstName: "Austen",
    lastName: "McClernon",
    bio: "Back in 1971, we opened our first restaurant in the Sydney suburb of Yagoona. Today there are over 970 McDonald's restaurants across Australia and we employ more than 100,000 people across our restaurants and management offices.",
    experience: [
      "Maccas CEO",
      "McOverlord",
      "McManaging my McMinions and McMaking them build a mCportfolio"
    ],
    education: [
      "University of Maccas",
      "McRonald McDonald High"
    ],
    projects: [
      {
        id: "5f5a1acf925e4b1e8c2dd951",
        tags: [
          "rusty",
          "rust enthusiast"
        ],
        title: "Rust - The element",
        description: "Rust is an iron oxide, a usually reddish brown oxide formed by the reaction of iron and oxygen in the presence of water or air moisture. Several forms of rust are distinguishable both visually and by spectroscopy, and form under different circumstances.[1] Rust consists of hydrated iron(III) oxides Fe2O3·nH2O and iron(III) oxide-hydroxide (FeO(OH), Fe(OH)3).",
        // content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varietates autem iniurasque fortunae facile veteres philosophorum praeceptis instituta vita superabat. Videsne quam sit magna dissensio? A primo, ut opinor, animantium ortu petitur origo summi boni. Hanc ergo intuens debet institutum illud quasi signum absolvere. Quid sequatur, quid repugnet, vident. Atque his de rebus et splendida est eorum et illustris oratio. <mark>Duo Reges: constructio interrete.</mark> Itaque primos congressus copulationesque et consuetudinum instituendarum voluntates fieri propter voluptatem; Neque enim civitas in seditione beata esse potest nec in discordia dominorum domus; <a href=\"http://loripsum.net/\" target=\"_blank\">Quae diligentissime contra Aristonem dicuntur a Chryippo.</a> Quasi vero, inquit, perpetua oratio rhetorum solum, non etiam philosophorum sit. </p>\n\n<blockquote cite=\"http://loripsum.net\">\nDecius, princeps in ea familia consulatus, cum se devoverat et equo admisso in mediam aciem Latinorum irruebat, aliquid de voluptatibus suis cogitabat?\n</blockquote>\n\n\n<ol>\n<li>An me, inquam, nisi te audire vellem, censes haec dicturum fuisse?</li>\n<li>Cum praesertim illa perdiscere ludus esset.</li>\n<li>Ac tamen, ne cui loco non videatur esse responsum, pauca etiam nunc dicam ad reliquam orationem tuam.</li>\n</ol>\n\n\n<ul>\n<li>Aliter enim nosmet ipsos nosse non possumus.</li>\n<li>Sed quanta sit alias, nunc tantum possitne esse tanta.</li>\n</ul>\n",
        content: "https://res.cloudinary.com/dlh0pcycr/image/upload/v1601561294/bqui37dqk8ma8ty46w80.jpg",
        displayDate: "2020-09-10T12:23:43.821+00:00",
        createdDate: "2020-09-10T12:23:43.821+00:00",
        user: "austen@maccas.edu.au"
      }
    ],
    email: "austen@maccas.edu.au",
    logo: "https://res.cloudinary.com/dlh0pcycr/image/upload/v1600790992/ko85xhtwshwjvimpnmak.png",
    resume: "https://res.cloudinary.com/dlh0pcycr/image/upload/v1600791776/vwrbvlhmjgroxzktbefu.pdf"
  }

  const [_projects, toggleExpand] = useState(profile.projects.map(project => { return { ...project, expand: false } }));

  const onExpandClick = id => toggleExpand(_projects.map(
    project => project.id === id
      ? { ...project, expand: !project.expand }
      : project
  ));

  const getContentType = content => {

    if (content) {
      if (isUrl(content)) {
        return (isImage(content.split('?')[0])) ? 'image' : 'url';
      } else {
        return 'text';
      }
    }

    return null;
  }

  const toLongDate = date => Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(Date.parse(date));

  return(
    <>
      <Button as={Link} to="/dashboard" variant="link">Back to dashboard</Button>
      <Container className="share">
        <Row>
          <Col xs="auto">
            <Image roundedCircle className="logo" src={profile.logo}/>
          </Col>
          <Col>
            <Row className="name">{profile.firstName} {profile.lastName}</Row>
            <Row className="bio">{profile.bio}</Row>
            <Row className="links">
              <Button as="a" href={profile.resume} variant="link"><FontAwesomeIcon icon={faFilePdf}/> Resume</Button>
              <Button as="a" href={`mailto:${profile.email}`} variant="link"><FontAwesomeIcon icon={faEnvelope}/> {profile.email}</Button>
            </Row>
          </Col>
        </Row>
        <Row>
          {_projects.map(project =>
            <Row key={project.id} className="project">
              <Row>
                <Col xs="auto" className="date">{toLongDate(project.displayDate)}</Col>
                <Col>
                  <Row className="title">{project.title}</Row>
                  <Row className="description">{project.description}</Row>
                  <Button variant="link" onClick={() => onExpandClick(project.id)}>
                    {project.expand && <>Hide project <FontAwesomeIcon icon={faArrowCircleUp}/></>}
                    {!project.expand && <>Show project <FontAwesomeIcon icon={faArrowCircleDown}/></>}
                  </Button>
                </Col>
              </Row>
              <Collapse in={project.expand}>
                <Row>
                  {(getContentType(project.content) === 'text') && <div dangerouslySetInnerHTML={{ __html: project.content }}/>}
                  {(getContentType(project.content) === 'image') && <a href={project.content} target="_blank"><Image src={project.content}/></a>}
                  {(getContentType(project.content) === 'url') && <a href={project.content} target="_blank">External link</a>}
                </Row>
              </Collapse>
              <hr/>
            </Row>
          )}
        </Row>
      </Container>
    </>
  );
}
