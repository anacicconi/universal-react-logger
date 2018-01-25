# universal-react-logger

A logger to catch client errors on the server.

In an universal javascript application using ReactJS, we usually want to log the front errors the same way we do on the server. 

The Error Boundaries introduced by React 16 are a nice way to catch errors during the rendering. However, they don't catch event errors. For instance, errors found once a button is clicked.

What this library does is take advantage of Error Boundaries for render errors but also add a way to catch event errors.

Everything is centralized and sent to the server which can log these errors or send them to external log services.

## Requirements

    "react": "^16.2.0"
    "react-router-dom": "^4.2.2"

## Install

npm i universal-react-logger

## How to use it

1- Create a route on the server called 'log-client-errors'

Example:

    /**
     * Post client errors in order to log them
     */
    app.post('/log-client-errors', (req, res) => {
    
        let error       = req.body.error.message;
        let errorInfo   = req.body.error.stack;
    
        // send these errors to some service or to a logger (ex: winston)
        //ex: logger.error(`The app received a new client log: ${error} ${errorInfo}`);
    
        res.status(200);
    });

2- Import the ErrorHandler HOC and use it on your components

Example:

    import { ErrorHandler} from 'universal-react-logger';
    
    class Homepage extends React.Component {
    
        constructor(props) {
            super(props);
            this.state = {
                counter: 0,
                error: this.props.error,
                errorInfo: this.props.errorInfo
            };
            this.handleClick = this.handleClick.bind(this);
            this.makeError = this.makeError.bind(this);
        }
    
        handleClick() {
            this.setState(({counter}) => ({
                counter: counter + 1
            }));
        }
    
        makeError () {
            try{
                // pretend to call a function that does not exist
                this.functionThatDontExist();
            } catch(error) {
                // send the error using the setEventError function
                this.props.setEventError(error);
            }
        };
    
        render() {
            if (this.state.counter === 5) {
                // Simulate a render error
                throw new Error('Error on render');
            }
    
            return (
                <div>
                    <h1 key="welcome">Hello World</h1>
                    <h1 onClick={this.handleClick}>{this.state.counter}</h1>
                    <button onClick={() => {this.makeError()}}>make event error</button>
                </div>
            );
        }
    }
    
    export default ErrorHandler(Homepage, true);

Obs: notice that we export the component passing "true" as the second parameter. This will render a page with the text "Something went wrong." instead of the component. Use it for components that should crash the application if there is a bug. Example: the menu.

And that's it! ;) 
