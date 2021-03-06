import React, { Component } from 'react';
import Button from './button'
import Snackbar from './snackbar';
import Textfield from './textInput';
import axios from 'axios';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { NavLink, BrowserRouter as Router } from 'react-router-dom';
let year = new Date().getFullYear();

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !re.test(String(email).toLowerCase());
}

class Footer extends Component {
    constructor(props) {
      super(props);
      this.state = { 
          openSuccess: false,
          openError: false,
          email: '',
          subject:'',
          name:'',
          message: '',
          emailError:false,
          subjectError: false,
          nameError: false,
          messageError: false
        };
    }

    handleSubmit = e => {
        console.log('called submit form')
        e.preventDefault();

        // check all the states to see if one is in error
        let errors = {};
        let raiseErrors = false;
        Object.keys(this.state).map(state => 
            { 
                console.log(state);
                console.log(this.state[state])
                if (['name','message','subject'].includes(state)) {
                    if (this.state[state] == '') {
                        // non-empty error
                        errors[state + 'Error'] = true;
                        raiseErrors = true;
                    } else {
                        errors[state + 'Error'] = false;
                    }
                 } else if (state == 'email') {
                    // validate email using regex
                    if (validateEmail(this.state[state])) {
                        errors['emailError'] = true;
                        raiseErrors = true;
                    } else {
                        errors['emailError'] = false;
                    }
                 }
            }  
        )

        if (raiseErrors) {
            // set the error state
            errors.openError = true;
            this.setState(errors);
        } else {
            // no errors are reported, sent off the contact email
            axios.post('/mail' , {
                name: this.state.name,
                message: this.state.message,
                email: this.state.email,
                subject: this.state.subject
            })
            .then(response => {
                console.log(response.data);
    
                this.setState({
                    name: '',
                    email: '',
                    message: '',
                    subject:'',
                    openSuccess: true,
                    nameError: false,
                    emailError:false,
                    subjectError:false,
                    messageError:false
                })
            })
            .catch(error => console.log(error))
        }
    }

    handleChange = name => event => {

        this.setState({
            [name]: event.target.value
        });
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({
            openSuccess: false,
            openError: false
        })
      }

    render() {

        return (      
            <div>
                <Snackbar handleClose={this.handleClose} open={this.state.openSuccess} variant={'success'} message={"Thanks for getting in contact! We'll reach out soon"} />
                <Snackbar handleClose={this.handleClose} open={this.state.openError} variant={'error'} message={"You've got some errors on the page"} />

                <section id="contact">
                                <div class="container">
                                <div style={{visibility:'visible !important'}}class="row wow fadeInUp">

                                    <div class="col-lg-4 col-md-4">
                                    <div class="contact-about">
                                        <h3>
                                            <span style={{color:'#00a3d6'}}>T</span>
                                            <span style={{color:'#f43044'}}>e</span>
                                            <span style={{color:'#4fad13'}}>k</span>
                                            <span style={{color:'#ffbc27'}}>b</span>
                                            <span style={{color:'#f9dd06'}}>l</span>
                                            <span style={{color:'#00a3d6'}}>g</span>
                                        </h3>
                                        <p>A university of Waterloo Student Initiative. For any questions regarding custom integrations and projects, please write us a message. Our service team will promptly reply. Remember, you are what makes us awesome.</p>
                                        {/* <div class="social-links">
                                        <a href="#" class="twitter"><i class="fa fa-twitter"></i></a>
                                        <a href="#" class="facebook"><i class="fa fa-facebook"></i></a>
                                        <a href="#" class="instagram"><i class="fa fa-instagram"></i></a>
                                        <a href="#" class="google-plus"><i class="fa fa-google-plus"></i></a>
                                        <a href="#" class="linkedin"><i class="fa fa-linkedin"></i></a>
                                        </div> */}
                                    </div>
                                    </div>

                                    <div class="col-lg-3 col-md-4">
                                    <div class="info">
                                        <div>
                                        <p>University of Waterloo<br/>200 University Avenue West Waterloo, Ontario, N2L 3G1</p>
                                        </div>

                                        <div>
                                        <p>christian@tekblg.com</p>
                                        </div>

                                    </div>
                                    </div>

                                    <div class="col-lg-5 col-md-8">
                                    <div class="form">
                                        <form id="contactForm" role="form" class="contactForm">
                                        <div style={{margin: 0}} class="form-row">
                                            <div style={{padding: 0}} class="form-group col-lg-6">
                                                <Textfield helperText={(this.state.nameError) ? 'Please fill out your name' : ''} error={this.state.nameError} name={'name'} value={this.state.name} handleChange={this.handleChange} />
                                            </div>
                                            <div style={{padding: 0}} class="form-group col-lg-6">
                                                <Textfield helperText={(this.state.emailError) ? 'Please fill out your email' : ''} error={this.state.emailError} name={'email'} value={this.state.email} handleChange={this.handleChange} />
                                             </div>
                                        </div>
                                        <div class="form-group">
                                            <Textfield helperText={(this.state.subjectError) ? 'Please fill out the subject' : ''} error={this.state.subjectError} name={'subject'} value={this.state.subject} handleChange={this.handleChange} />
                                        </div>
                                        <div class="form-group">
                                            <Textfield helperText={(this.state.messageError) ? 'Please have a non-empty message' : ''} error={this.state.messageError} multiline name={'message'} value={this.state.message} handleChange={this.handleChange} />
                                        </div>
                                            <div class="text-center"><Button handleClick={this.handleSubmit} label={'Contact Tekblg'}/></div>
                                        </form>
                                    </div>
                                    </div>

                                </div>

                                </div>
                            </section>
                            <footer style={{position:'relative'}} id="footer">
                                <LazyLoad placeholder={<p>Lazy Loading...</p>}><img style={{position: 'absolute', width: 200, opacity:0.3, left: 0, bottom: 0}} src={`https://images.ctfassets.net/5zy76n4olg5p/4V4rBRxxjMyzWrm0or4cIh/19716e176680f3d182d425f51ea83a70/legoCorner.png?w=${200}&fm=jpg&fl=progressive`} /></LazyLoad>
                                <div class="container">
                                    <div class="row">
                                    <div class="col-lg-6 text-lg-left text-center">
                                        <div class="copyright">
                                        &copy; Copyright <strong>Tekblg {year}</strong>. All Rights Reserved
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <nav class="footer-links text-lg-right text-center pt-2 pt-lg-0">
                                        <Router forceRefresh="true">
                                            <a style={{color:'#888 !important'}} href="#intro" class="scrollto">Home</a>
                                            <a style={{color:'#888 !important'}} href="#about" class="scrollto">About</a>
                                            <a style={{color:'#888 !important'}} href="#contact" class="scrollto">Contact</a>
                                            <NavLink style={{color:'#888 !important'}} to="/privacy-policy">Privacy Policy</NavLink>
                                            <NavLink style={{color:'#888 !important'}} to="/terms-of-use">Terms of Use</NavLink>
                                        </Router>
                                        </nav>
                                    </div>
                                    </div>
                                </div>
                            </footer>
            </div>
           
            )
    }
}


const mapStateToProps = state => (
    { state: state.AppReducer }
)

export default connect(mapStateToProps, { })(Footer);