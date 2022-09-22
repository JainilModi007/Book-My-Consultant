package com.upgrad.bookmyconsultation.exception;

public class UnauthorizedException extends RestException {

    public UnauthorizedException(final ErrorCode errorCode, final Object... parameters){
        super(errorCode, parameters);
    }

}

//public class UnauthorizedException extends RuntimeException {
//
//    public UnauthorizedException(String message) {
//        super(message);
//    }
//
//}