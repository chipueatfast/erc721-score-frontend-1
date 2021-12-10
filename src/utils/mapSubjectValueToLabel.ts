import { DictSubjectLabelValue } from "models/DictSubjectLabelValue";

export function mapSubjectValueToLabel(inputValue: string): string | undefined {
    return DictSubjectLabelValue.find(a => a.value === inputValue)?.label;
}