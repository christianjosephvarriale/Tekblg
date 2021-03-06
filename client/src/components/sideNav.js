import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import '../css/sideNav.css';
import lego from '../img/redLego.png';
import $ from 'jquery';

const CustomTooltip = withStyles(theme => ({
    tooltip: {
      fontSize: 15,
      fontFamily: 'Montserrat'
    },
  }))(Tooltip);

const styles = () => ({
    container: {
        top: '30%',
        left: 30,
        position:'fixed',
        zIndex: 1000,
        height: 320,
        overflowY: 'hidden',
        padding: 20
    },
    dotContainer: {
        display: 'block',
        position: 'relative',
        width: '30px !important',
        height: '50px !important',
    },
    dot: {
        position:'absolute',
        top: 6,
        transition: '.2s ease-out',
    },
});

class SideNav extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            type: 'Dot', /* Either Dot or Text */
            currentSec: 0,
            posArray: [],
        };
    }

    handleScroll = () => {

        let scroll = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop;
        
        const { posArray } = this.state;
        let currentSec;
        for (let i = 0; i < posArray.length; i++) { 
            /* parse the dot pos lst to determine grow state */
            
            if ( scroll < posArray[0] ) {
                currentSec = 0;
                break;
            }

            if (i === posArray.length - 1) { 
                /* we've reached the end */
                currentSec = i;
                break;
            } 
            if ( (scroll >= posArray[i]) && scroll < posArray[i+1] ) {
                currentSec = i;
                break;
            }
        }

        this.setState({ currentSec });
    }

    componentDidMount() {

        // calculate the distance to the top for all dots
        let { sectionIds } = this.props;
        sectionIds = Object.values(sectionIds);
        const posArray = [];
        for (let i=0; i<sectionIds.length; i++){
            const el = document.getElementById(sectionIds[i])
            const distance = window.pageYOffset + el.getBoundingClientRect().top
            posArray.push(distance);
        }
        this.setState({ posArray })

        window.addEventListener('scroll', this.handleScroll);

    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const { classes } = this.props;
        let sectionsHTML;

        setTimeout(() => {
            $('.dots').css({
                transform: `translate(0, -${Math.floor(this.state.currentSec / 6) * 320}px)`,
            });
        },0)

        if ( this.state.type === 'Dot' ) {
            sectionsHTML = Object.keys(this.props.sectionIds).map((key, i) => {
                return ( <CustomTooltip title={key} arrow placement="right">
                    <a href={`#${this.props.sectionIds[key]}`} className={`dots ${classes.dotContainer}`}>
                        <img src={lego} id={`dot${i}`} className={`${classes.dot} ${this.state.currentSec === i ? 'grow' : ''}`} />
                    </a>
                </CustomTooltip> );
            });
        }
        
        return (
            <div className={`${classes.container} legoSlider`}>
                {sectionsHTML} 
            </div>
          )
      } 
}
export default withStyles(styles)(SideNav);