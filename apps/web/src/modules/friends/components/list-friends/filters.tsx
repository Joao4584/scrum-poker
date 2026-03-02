// import { useScopedI18n } from '@/modules/locales/client'

// import { GroupsMultiSelect } from '@/modules/access/groups/components/groups-multiselect'
// import { SelectProfiles } from '@/modules/access/profiles/components/profiles-select'

// import { Filters } from '@/modules/shared/components/filters/filters'
// import { CompletedFilters } from '@/modules/shared/components/filters/types'

// interface UsersFiltersProps {
//   onFilter: (filters: CompletedFilters) => void
//   defaultValue: CompletedFilters
//   translations: {
//     title: string
//     description: string
//   }
// }

// export function UsersFilters({
//   translations,
//   defaultValue,
//   onFilter,
// }: UsersFiltersProps) {
//   const t = useScopedI18n('access.users.components.users-table.columns')

//   const config = {
//     availableFilters: [
//       {
//         label: t('name'),
//         value: 'name',
//       },
//       {
//         label: t('email'),
//         value: 'email',
//       },
//       {
//         label: t('username'),
//         value: 'username',
//       },
//       {
//         label: t('created_at'),
//         value: 'created_at',
//       },
//       {
//         label: t('status'),
//         value: 'status',
//       },
//       {
//         label: t('groups'),
//         value: 'groups',
//       },
//       {
//         label: t('profile'),
//         value: 'profile',
//       },
//     ],
//     filters: [
//       {
//         id: 'name',
//         type: 'text',
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//           {
//             label: 'contains',
//             value: 'CT',
//           },
//           {
//             label: 'not-contains',
//             value: 'NOTCT',
//           },
//         ],
//       },
//       {
//         id: 'email',
//         type: 'text',
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//           {
//             label: 'contains',
//             value: 'CT',
//           },
//           {
//             label: 'not-contains',
//             value: 'NOTCT',
//           },
//         ],
//       },
//       {
//         id: 'username',
//         type: 'text',
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//           {
//             label: 'contains',
//             value: 'CT',
//           },
//           {
//             label: 'not-contains',
//             value: 'NOTCT',
//           },
//         ],
//       },
//       {
//         id: 'created_at',
//         type: 'date',
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//         ],
//       },
//       {
//         id: 'status',
//         type: 'select',
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//         ],
//         options: [
//           {
//             label: t('active'),
//             value: 'active',
//           },
//           {
//             label: t('inactive'),
//             value: 'inactive',
//           },
//         ],
//       },
//       {
//         id: 'groups',
//         type: 'multiselect',
//         customRender: GroupsMultiSelect,
//         operators: [
//           {
//             label: 'contains',
//             value: 'EQ',
//           },
//           {
//             label: 'not-contains',
//             value: 'NOTEQ',
//           },
//         ],
//       },
//       {
//         id: 'profile',
//         type: 'select',
//         customRender: SelectProfiles,
//         operators: [
//           {
//             label: 'equal',
//             value: 'EQ',
//           },
//           {
//             label: 'not-equal',
//             value: 'NOTEQ',
//           },
//         ],
//       },
//     ],
//   }

//   return (
//     <Filters
//       filtersAPIPath="assistance/access/list/users/aurora/filters"
//       defaultValue={defaultValue}
//       config={config}
//       onFilter={onFilter}
//       title={translations.title}
//       description={translations.description}
//     />
//   )
// }
