import * as Promise from 'bluebird';

declare module "node-7z" {
  interface ICommandLineSwitches {
    raw?: Array<string>;
    [key: string]: any
  }

  interface IFileSpec {
    path: string;
    type: string;
    method: string;
    physicalSize: number;
  }

  interface IFileEntry {
    date: Date;
    size: number;
    name: string;
    attr: string;
  }

  interface IProgressCB {
    (entries: string[], percent: number): void;
  }

  interface IResult {
    code: number;
    errors: string[];
  }

  class Zip {
    add(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<IResult>;
    delete(archive: string, files: string | Array<string>, options?: ICommandLineSwitches): Promise<IResult>;
    extract(archive: string, dest: string, options?: ICommandLineSwitches, progress?: IProgressCB, passwordCB?: () => Promise<string>): Promise<IResult>;
    extractFull(archive: string, dest: string, options?: ICommandLineSwitches, progress?: IProgressCB, passwordCB?: () => Promise<string>): Promise<IResult>;
    list(archive: string, options?: ICommandLineSwitches, progress?: (entries: IFileEntry[]) => void): Promise<IFileSpec>;
    test(archive: string, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<IResult>;
    update(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<IResult>;
  }

  export = Zip;
}
