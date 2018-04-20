import http from 'http';
import * as oas3 from 'openapi3-ts';

import { JsonPath } from '../utils/jsonPaths';
import { ValidatorFunction, IValidationError } from './validation';
import { BodyParser } from '../bodyParsers/BodyParser';
import { Controller } from '../controllers/types';

// This file provides an interface into the `oas3` subdirectory.  The idea here is,
// when `oas4` comes along we can support it by writing a new `oas4` subdirectory
// that implements this same interface, and then we'll be able to support oas4
// wihtout changing anything.  (We'll see if this actually works.  :P)

export interface ParametersByLocation<T> {
    query: T;
    header: T;
    server: T;
    path: T;
    cookie: T;
}

// A collection of parameters from the server, path, query, cookies, etc...
export interface ParametersMap<T> {
    [key: string]: T;
}

export type ParsedParameterValidator =
    ((parameterValues: ParametersByLocation<ParametersMap<any>>) => IValidationError[] | null) | undefined;

// This bit is OAS3 specific.  May change in future versions.
export interface ResolvedOAS3 {
    openApiDoc: oas3.OpenAPIObject;
    serverObject: oas3.ServerObject | undefined;
    pathPath: JsonPath;
    pathObject: oas3.PathItemObject;
    operationPath: JsonPath | undefined;
    operationObject: oas3.OperationObject | undefined;
    requestBodyMediaTypePath: JsonPath | undefined;
    requestBodyMediaTypeObject: oas3.MediaTypeObject | undefined;
}

export interface ResolvedPath {
    serverParams: ParametersMap<string | string[]> | undefined;
    parseParameters: (() => ParametersByLocation<ParametersMap<any>>) | undefined;
    validateParameters: ParsedParameterValidator;
    bodyParser: BodyParser | undefined;
    validateBody: ValidatorFunction | undefined;
    exegesisControllerName: string;
    operationId: string;
    controller: Controller | undefined;
    // responseValidator,
    // responseContentType?,
    openapi: ResolvedOAS3;
}

export interface ApiInterface {
    /**
     * Resolve an incoming request.
     *
     * @param method - The HTTP method used (e.g. 'GET').
     * @param url - The URL used to retrieve this request.
     * @param headers - Any headers sent along with the request.
     * @throws {ValidationError} if some parameters cannot be parsed.
     */
    resolve(
        method: string,
        url: string,
        headers: http.IncomingHttpHeaders
    ) : ResolvedPath | undefined;
}
