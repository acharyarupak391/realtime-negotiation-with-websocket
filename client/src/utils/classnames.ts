function classnames(...args: any[]): string {
  return args.filter(Boolean).join(' ');
}

export { classnames}