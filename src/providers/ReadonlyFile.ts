import {
  Disposable,
  Event,
  EventEmitter,
  FileChangeEvent,
  FileStat,
  FileSystemError,
  FileSystemProvider,
  FileType,
  Uri,
  workspace
} from 'vscode';
import { decryptTextByFileName } from '../commands/decrypt';
import { DocumentSchemes } from '../constants';

export class ReadonlyFileProvider implements FileSystemProvider, Disposable {
  private readonly _disposable: Disposable;

  constructor() {
      this._disposable = Disposable.from(
          workspace.registerFileSystemProvider(DocumentSchemes.ReadonlyFile, this, {
              isCaseSensitive: true,
              isReadonly: true
          })
      );
  }

  dispose() {
    this._disposable && this._disposable.dispose();
  }

  private _onDidChangeFile = new EventEmitter<FileChangeEvent[]>();

  get onDidChangeFile(): Event<FileChangeEvent[]> {
    return this._onDidChangeFile.event;
  }

  watch(): Disposable {
    return { dispose: () => {} };
  }

  stat(uri: Uri): FileStat {
    return {
      type: FileType.File,
      size: 10,
      ctime: 0,
      mtime: 0
    };
  }

  readDirectory(uri: Uri): [string, FileType][] {
    return [[uri.path, FileType.File]];
  }

  copy?(): void | Thenable<void> {
    throw FileSystemError.NoPermissions;
  }
  createDirectory(): void | Thenable<void> {
    throw FileSystemError.NoPermissions;
  }
  delete(): void | Thenable<void> {
    throw FileSystemError.NoPermissions;
  }

  rename(): void | Thenable<void> {
    throw FileSystemError.NoPermissions;
  }

  writeFile(): void | Thenable<void> {
    throw FileSystemError.NoPermissions;
  }

  async readFile(uri: Uri): Promise<Uint8Array> {
    function stringToUint8Array(str: string){
      var arr = [];
      for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
      }

      var tmpUint8Array = new Uint8Array(arr);
      return tmpUint8Array;
    }
    const { fsPath } = uri;

    const data = await decryptTextByFileName(fsPath + '.encrypt');
    return stringToUint8Array(data);
  }

}