import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Interweave from 'interweave';


import Tag from './Tag';
import ContentItemMenu from './ContentItemMenu';

import { parseDate } from '../../common/helpers';

const isUrl = require('is-valid-http-url');
const isImage = require('is-image');

export default function ContentItem({ content }) {

  const { id, title, description, displayDate } = content;
  let { tags } = content;
  const date = parseDate(displayDate);

  // Bandaid
  if (tags.length === 1) tags = tags[0].split(',');

  tags = content.tags.map(tag => {
    if (typeof tag === 'string') return { tag: tag, variant: 'default' }
    else return tag;
  });

  // Determine variant of ContentItem to use
  let image = false;
  if (content.content) {
    if (isUrl(content.content)) {
      if (isImage(content.content.split('?')[0])) {
        image = true;
      }
    }
  }

  return(
    <Container className="contentitem contentitem-container" key={id}>
      <div className="contentitem contentitem-card">
        <Row className="contentitem contentitem-head">
          <Col xs={11}>
            <Row className="contentitem contentitem-title">{title}</Row>
            <Row className="contentitem contentitem-date">{date}</Row>
          </Col>
          <Col>
            <Row className="contentitem contentitem-menu">
              <ContentItemMenu content={content}/>
            </Row>
          </Col>
        </Row>
        <Row className="contentitem contentitem-body">
          {image && 
            (<Col className="contentitem contentitem-image-container" md={3}>
              <Row className="contentitem contentitem-image-container">
                <img className="contentitem contentitem-image" src={content.content} alt={title}></img>
              </Row>
          </Col>)}
          <Col>
            <Row>
              <p className="contentitem contentitem-description">{description}</p>
            </Row>
            <Row>
            {!image && <div><hr></hr><Interweave content={content.content}/></div>} 
            </Row>
          </Col>
          
        </Row>
        <Row className="contentitem contentitem-footer">
          <div className="contentitem contentitem-container contentitem-tags">
            {tags.map((tag, index) => 
              <Tag
                key={index}
                colour={tag.variant}
                shape={index === 0 ? 'first' : index === (tags.length - 1) ? 'last' : 'mid'}
                tag={tag.tag}
              />
            )}
          </div>
        </Row>
      </div>
    </Container>
  );
}
