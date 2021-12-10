export function parseEVMErrorMessage(evmErrorMessage: string): string {
    const sample_error_start_pattern = `Error: [ethjs-query] while formatting outputs from RPC '`;
    if (evmErrorMessage.startsWith(sample_error_start_pattern)) {
        const jsonStringified = evmErrorMessage
        .substr(0, evmErrorMessage.length - 1) // remove the ' mark
        .replace(sample_error_start_pattern, '')
        .replace(`\n`, '');
        return JSON.parse(jsonStringified).value.data.message;
    }
    return evmErrorMessage;
}
