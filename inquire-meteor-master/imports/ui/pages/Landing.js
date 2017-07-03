import React from 'react';
import { Link } from 'react-router';
import { Jumbotron,Grid,Row,Col } from 'react-bootstrap';

const Landing = () => (
  <div className="Index">
    <Jumbotron className="text-center">
      <h2>INQUIRE</h2>
      <p>Extract meaningful information from large corpuses of data!</p>
      <Link to="/signup">
          <p className="btn btn-primary" role="button">Get Started</p>
      </Link>
    </Jumbotron>

    <Grid>
      <Row className="show-grid">
        <Col xs={6} md={4}>
          <img className="img-responsive" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140" />
          <h2>Heading</h2>
          <p>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.</p>
          <p><a className="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </Col>

        <Col xs={6} md={4}>
          <img className="img-responsive" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140" />
          <h2>Heading</h2>
          <p>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.</p>
          <p><a className="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </Col>

        <Col xs={6} md={4}>
          <img className="img-responsive" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" width="140" height="140" />
          <h2>Heading</h2>
          <p>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam id dolor id nibh ultricies vehicula ut id elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Praesent commodo cursus magna.</p>
          <p><a className="btn btn-default" href="#" role="button">View details &raquo;</a></p>
        </Col>

      </Row>

      <hr className="featurette-divider"></hr>

      <Row>
        <Col md={7}>
          <h2 className="featurette-heading">First featurette heading. <span className="text-muted">It'll blow your mind.</span></h2>
          <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
        </Col>
        <Col md={5}>
          <img className="featurette-image img-responsive center-block" src="/fiver.jpg" alt="Generic placeholder image" />
        </Col>
      </Row>

      <hr className="featurette-divider"></hr>

      <Row>
        <Col md={7} mdPush={5}>
          <h2 className="featurette-heading">Oh yeah, it's that good. <span className="text-muted">See for yourself.</span></h2>
          <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
        </Col>
        <Col md={5} mdPull={7}>
          <img className="featurette-image img-responsive center-block" src="/fiver.jpg" alt="Generic placeholder image" />
        </Col>
      </Row>

      <hr className="featurette-divider"></hr>

      <Row>
        <Col md={7}>
          <h2 className="featurette-heading">And lastly, this one. <span className="text-muted">Checkmate.</span></h2>
          <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
        </Col>
        <Col md={5}>
          <img className="featurette-image img-responsive center-block" src="/fiver.jpg" alt="Generic placeholder image" />
        </Col>
      </Row>

    </Grid>

 </div>
);

export default Landing;
