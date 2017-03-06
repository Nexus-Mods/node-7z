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

  class Zip {
    add(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: (fileNames: string[]) => void): Promise<void>;
    delete(archive: string, files: string | Array<string>, options?: ICommandLineSwitches): Promise<void>;
    extract(archive: string, dest: string, options?: ICommandLineSwitches, progress?: (fileNames: string[]) => void): Promise<void>;
    extractFull(archive: string, dest: string, options?: ICommandLineSwitches, progress?: (fileNames: string[]) => void): Promise<void>;
    list(archive: string, options?: ICommandLineSwitches, progress?: (entries: IFileEntry[]) => void): Promise<IFileSpec>;
    test(archive: string, options?: ICommandLineSwitches, progress?: (fileNames: string[]) => void): Promise<void>;
    update(archive: string, files: string | Array<string>, options?: ICommandLineSwitches, progress?: (fileName: string[]) => void): Promise<void>;
  }

  export = Zip;
}
