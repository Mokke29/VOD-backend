import express, { Request } from 'express';

declare module 'express' {
  export interface RequestExtended extends Request {
    user?: any;
    body: { [key: string]: string | undefined };
  }
  export interface RequestDefinedBody extends Request {
    user?: any;
    body: { [key: string]: string };
  }
}
