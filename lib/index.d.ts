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

  class Zip {
    add(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<void>;
    delete(archive: string, files: string | Array<string>, options?: ICommandLineSwitches): Promise<void>;
    extract(archive: string, dest: string, options?: ICommandLineSwitches, progress?: IProgressCB, passwordCB?: () => Promise<string>): Promise<void>;
    extractFull(archive: string, dest: string, options?: ICommandLineSwitches, progress?: IProgressCB, passwordCB?: () => Promise<string>): Promise<void>;
    list(archive: string, options?: ICommandLineSwitches, progress?: (entries: IFileEntry[]) => void): Promise<IFileSpec>;
    test(archive: string, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<void>;
    update(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: IProgressCB): Promise<void>;
  }

  export = Zip;
}
