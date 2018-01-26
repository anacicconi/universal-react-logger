'use strict';

import React from 'react';

import { default as ErrorBoundary } from './error-boundary';

function ErrorHandler (WrappedComponent, critical) {

    return class extends React.Component {

        constructor (props) {
            super(props);
            this.state = {
                eventError: null
            };
            this.setEventError = this.setEventError.bind(this);
        }

        setEventError(eventError) {
            this.setState({eventError});
        }

        render () {
            if (this.state.eventError) {
                return (
                    <ErrorBoundary critical={critical} eventError={this.state.eventError}>
                        <WrappedComponent setEventError={this.setEventError} {...this.props}/>
                    </ErrorBoundary>
                )
            }

            return (
                <ErrorBoundary critical={critical}>
                    <WrappedComponent setEventError={this.setEventError} {...this.props}/>
                </ErrorBoundary>
            );
        }
    }
}

export default ErrorHandler;
