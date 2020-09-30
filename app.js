import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Switch, withRouter } from 'react-router-dom';
import _ from 'lodash';

import { Biography } from './components/bio';
import { ContactInfo } from './components/contact';
import { Communities } from './components/communities';
import { Commitments } from './components/commitments';
import { Funding } from './components/funding';
import { Publications } from './components/publications';
import { Posts } from './components/posts';
import { Impact } from './components/impact';
import { Students } from './components/students';
import { Header } from './components/header';
import { Projects } from './components/projects';
import { Project } from './components/project';
import { Advice } from './components/advice';
import { Classes } from './components/classes';
import { Talks } from './components/talks';
import { Books } from './components/books';
import { Travel } from './components/travel';
import { Vita } from './components/cv';
import { CER } from './components/cer';
import { Unknown } from './components/unknown';
import { Footer } from './components/footer';

import { Profile } from './data/profile';

// Polyfill startsWith
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

class App extends React.Component {

	constructor(props) {

		super(props);
		
		// Start data as undefined, rending a loading state until it changes.
		this.state = {
			profile: undefined
		};
		
		fetch(this.getWebRoot() + "/data/data.json")
			.then(response => response.json())
			.then(data => {
				// Yay, we got data! Set the state so the page renders.
				this.setState({ profile: new Profile(data) });
			})
			.catch(err => { 
				// Uh oh, something bad happened. Set data to null to render an error.
				this.setState({ profile: null });
				console.error(err);
			});
		
	}
	
	getWebRoot() { return this.props.root; }

	render() {
		
		var currentRoute = this.props.location.pathname;
		
		// Return the single page app.
		return (
			<div className="container">
				{currentRoute === "/cv" ? null : <Header path={currentRoute} app={this} />}				
				{
					this.state.profile === undefined ? 
						<center><img src="images/icons/loading.gif" /></center> :
					this.state.profile === null ?
						<div className='alert alert-danger'>There was a problem loading the site content. Amy will fix it right away!</div> :
						<Switch>
							<Route exact path="/" render={(props) => <Projects {...props} app={this} />} />
							<Route path="/bio" render={(props) => <Biography {...props} app={this} />} />
							<Route path="/publications/:paper?" render={(props) => <Publications {...props} app={this} />} />
							<Route path="/posts" render={(props) => <Posts {...props} app={this} />} />
							<Route path="/impact" render={(props) => <Impact {...props} app={this} />} />
							<Route path="/advice" render={(props) => <Advice {...props} app={this} />} />
							<Route path="/classes" render={(props) => <Classes {...props} app={this} />} />
							<Route path="/talks" render={(props) => <Talks {...props} app={this} />} />
							<Route exact path="/books" render={(props) => <Books {...props} app={this} />} />
							<Route path="/books/:unknown" component={Unknown} />
							<Route path="/travel" render={(props) => <Travel {...props} app={this} />} />
							<Route path="/contact" render={(props) => <ContactInfo {...props} app={this} />} />
							<Route path="/communities" render={(props) => <Communities {...props} app={this} />} />
							<Route path="/funding" render={(props) => <Funding {...props} app={this} />} />
							<Route path="/commitments" render={(props) => <Commitments {...props} app={this} />} />
							<Route path="/lab" render={(props) => <Students {...props} app={this} />} />
							<Route path="/students/:student?" render={(props) => <Students {...props} app={this} profile={this.state.profile} />} />
							<Route path="/projects/:id" render={(props) => <Project {...props} app={this} />} />
							<Route path="/cv" render={(props) => <Vita {...props} app={this} />} />
							<Route path="/cer" component={CER}/>
							<Route path="404" component={Unknown}/>
							<Route path="*" component={Unknown}/>
						</Switch>	
				}
				{currentRoute === "/cv" ? null : <Footer/>}
			</div>
		)
	}

	getProfile() { return this.state.profile; }
	
}


var AppWithRouter = withRouter(App);
	
var webRoot = "/ajko" + (window.location.pathname.includes("/test") ? "/test" : "");	
	
// Construct the app, passing it the data.
ReactDOM.render((
	<BrowserRouter basename={webRoot}>
		<Route path="/" render={(props) => <AppWithRouter {...props} root={webRoot} /> } />
	</BrowserRouter>
), document.getElementById('app'));
