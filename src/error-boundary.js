'use strict';

import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            renderError: null,
            renderErrorInfo: null
        };
        this.resetRenderError   = this.resetRenderError.bind(this);
        this.resetEventError    = this.resetEventError.bind(this);
    }

    componentDidCatch(renderError, renderErrorInfo) {
        this.setState({
            renderError: renderError,
            renderErrorInfo: renderErrorInfo
        });
    }

    componentDidUpdate() {
        if (this.props.critical) {
            let body = {};

            if (this.state.renderError) {
                body = {
                    error: {
                        message: this.state.renderError.toString(),
                        stack: this.state.renderErrorInfo.componentStack
                    }
                };
            }

            if (this.props.eventError) {
                body = {
                    error: {
                        message: this.props.eventError.message,
                        stack: `in ${this.props.eventError.fileName} - line ${this.props.eventError.lineNumber} in ${this.props.eventError.stack}`
                    }
                };
            }

            // send the errors to the server
            if (body.error) {
                fetch('/log-client-errors', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
            }
        }
    }

    resetRenderError() {
        this.setState({
            renderError: null,
            renderErrorInfo: null
        });
    }

    resetEventError() {
        this.props.eventError = null;
    }

    render() {
        if (this.props.critical && this.state.renderError) {
            return (
                <div>
                    <Link to="/" onClick={this.resetRenderError}>Back to Homepage</Link>
                    <h2>Something went wrong.</h2>
                </div>
            );
        }

        if (this.props.critical && this.props.eventError) {
            return (
                <div>
                    <Link to="/" onClick={this.resetEventError}>Back to Homepage</Link>
                    <h2>Something went wrong.</h2>
                </div>
            )
        }

        // if the component error is not critical keep displaying the children
        return this.props.children;
    }
}

export default ErrorBoundary;
