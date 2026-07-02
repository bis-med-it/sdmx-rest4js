// The patterns defined by the SDMX RESTful API. Base patterns are composed
// into the anchored variants exported at the bottom of this file.

// Must begin with a letter, may be followed by letters, numbers, _ or -
const NCNameIDType = /[A-Za-z][A-Za-z0-9_-]*/;

const NCNameIDTypeAlone = new RegExp(`^${NCNameIDType.source}$`);

// An ID, potentially followed by a dot and other IDs
const NestedNCNameIDType = new RegExp(
  `${NCNameIDType.source}(\\.${NCNameIDType.source})*`
);

const NestedNCNameIDTypeAlone = new RegExp(
  `^${NestedNCNameIDType.source}$`
);

// Letters, numbers, _, @, $ or -
const IDType = /[A-Za-z0-9_@$-]+/;

const IDTypeAlone = new RegExp(`^${IDType.source}$`);

// A version number (e.g. 1.0)
const VersionNumber = /[0-9]+(\.[0-9]+)*/;

// Latest stable (+), latest (un)stable (~), or a major.minor.patch version,
// potentially followed by a pre-release and a build part
const SemVer = new RegExp(
  '\\+' +
  '|~' +
  '|(0|[1-9]\\d*[\\+~]?|[\\+~]?)' +
  '\\.(0|[1-9]\\d*[\\+~]?|[\\+~]?)' +
  '\\.?(0|[1-9]\\d*[\\+~]?|[\\+~]?)' +
  '(?:-((?:0|[1-9]\\d*' +
  '|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*' +
  '|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?' +
  '(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?'
);

// The string all, the string latest, a version number or semver
const VersionType = new RegExp(
  `(all|latest|${VersionNumber.source}|${SemVer.source})`
);

// The string latest, a version number or semver
const SingleVersionType = new RegExp(
  `(latest|${VersionNumber.source}|${SemVer.source})`
);

const SingleVersionTypeAlone = new RegExp(`^${SingleVersionType.source}$`);

const VersionNumberAlone = new RegExp(`^${VersionNumber.source}$`);

const VersionTypeAlone = new RegExp(`^${VersionType.source}$`);

// Letters, numbers, _, @, $ or -, potentially hierarchical (e.g. A.B.C)
const NestedIDType = /[A-Za-z0-9_@$-]+(\.[A-Za-z0-9_@$-]+)*/;

const NestedIDTypeAlone = new RegExp(`^${NestedIDType.source}$`);

// One or more dimension values separated by a +, potentially followed by a
// dot and repeating the same pattern
const SeriesKeyType = new RegExp(
  `^(${IDType.source}([+]${IDType.source})*)?` +
  `([.](${IDType.source}([+]${IDType.source})*)?)*$`
);

// One star or a dimension value, potentially followed by a dot and repeating
// the same pattern
const Sdmx3SeriesKeyType = new RegExp(
  `^(\\*|${IDType.source})?([.](\\*|${IDType.source})?)*$`
);

const FlowRefType = new RegExp(
  `^(${IDType.source}` +
  `|(${NestedNCNameIDType.source}` +
  `,${IDType.source}` +
  `(,(latest|(${VersionNumber.source})))?))$`
);

// May start with the agency owning the scheme, followed by the id of the
// provider
const ProviderRefType = new RegExp(
  `(${NestedNCNameIDType.source},)?${IDType.source}`
);

const MultipleProviderRefType = new RegExp(
  `^(${ProviderRefType.source}([+]${ProviderRefType.source})*)$`
);

const Sdmx_3_0_all = /\*/;

const MultipleAgencies = new RegExp(
  `(${Sdmx_3_0_all.source}` +
  `|${NestedNCNameIDType.source}([+,]${NestedNCNameIDType.source})*)`
);

const MultipleAgenciesRefType = new RegExp(`^${MultipleAgencies.source}$`);

const MultipleIDs = new RegExp(
  `(${Sdmx_3_0_all.source}|${IDType.source}([+,]${IDType.source})*)`
);

const MultipleIDType = new RegExp(`^${MultipleIDs.source}$`);

const MultipleNestedIDType = new RegExp(
  `^(${Sdmx_3_0_all.source}` +
  `|${NestedIDType.source}([+]${NestedIDType.source})*)$`
);

const MultipleVersions = new RegExp(
  `(${Sdmx_3_0_all.source}` +
  `|${VersionType.source}([,]${VersionType.source})*)`
);

const MultipleVersionsType = new RegExp(
  `^${VersionType.source}([+,]${VersionType.source})*$`
);

const ReportingPeriodType = /^\d{4}-([ASTQ]\d{1}|[MW]\d{2}|[D]\d{3})$/;

const ContextType = /(datastructure|dataflow|provisionagreement)/;

const MultipleContextType = new RegExp(
  `(${Sdmx_3_0_all.source}|${ContextType.source}([+,]${ContextType.source})*)`
);

// The context, then the separator between context & agency, then one or more
// agencies, then the separator between agency & id, then one or more artefact
// IDs, then one or more versions between parentheses
const ContextRefType = new RegExp(
  `^(${MultipleContextType.source}` +
  `=${MultipleAgencies.source}` +
  `:${MultipleIDs.source}` +
  `\\(${MultipleVersions.source}\\))$`
);

const Operators = /(eq|ne|lt|le|gt|ge|co|nc|sw|ew)/;

const FilterValue = new RegExp(`((${Operators.source}:)?${IDType.source})`);

const FiltersType = new RegExp(
  `^(${NCNameIDType.source}` +
  `=${FilterValue.source}([+,]${FilterValue.source})*)$`
);

export {
  NCNameIDTypeAlone as NCNameIDType,
  NestedNCNameIDTypeAlone as NestedNCNameIDType,
  IDTypeAlone as IDType,
  VersionTypeAlone as VersionType,
  SingleVersionTypeAlone as SingleVersionType,
  VersionNumberAlone as VersionNumber,
  NestedIDTypeAlone as NestedIDType,
  FlowRefType,
  ProviderRefType,
  MultipleProviderRefType,
  MultipleAgenciesRefType as AgenciesRefType,
  ReportingPeriodType,
  SeriesKeyType,
  Sdmx3SeriesKeyType,
  MultipleIDType,
  MultipleVersionsType,
  MultipleNestedIDType,
  ContextRefType,
  FiltersType,
};
