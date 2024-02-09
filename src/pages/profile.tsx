import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import TagSelector from '@/components/tag-selector'
import { useToast } from '@/components/toast'
import { UpdateConfigData } from '@/lib/scheduler-config'
import { NYLAS_AUTH_CONFIG, SKILLS, TIMEZONES } from '@/lib/constants'
import {
  useCalendars,
  useLoggedInUser,
  useSchedulingConfig,
  useUpdateSchedulingConfig,
  useUpdateUser,
} from '@/lib/hooks'
import { UserData } from '@/lib/types'
import { NylasLogin, NylasOpenHoursPicker, NylasProvider, defineCustomElements } from '@nylas/react'
import Head from 'next/head'
import { FormEventHandler, useEffect, useState } from 'react'

defineCustomElements()

export default function Profile() {
  const { addToast } = useToast()

  const { user, isLoading } = useLoggedInUser()
  const { updateUser } = useUpdateUser()

  const { calendars, isLoading: isLoadingCalendars } = useCalendars()

  const { config, isConfigLoading } = useSchedulingConfig()
  const { updateConfig } = useUpdateSchedulingConfig()

  const [profile, setProfile] = useState<Partial<UserData>>()
  const [schedulingConfig, setSchedulingConfig] = useState<UpdateConfigData>({
    availability_calendar_ids: [],
    availability_open_hours: [],
    booking_calendar_id: '',
  })

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!user) return

    setProfile(user)
  }, [isLoading, user])

  useEffect(() => {
    if (isConfigLoading) return
    if (!config) return

    setSchedulingConfig({
      availability_calendar_ids: config?.availability?.participants?.[0]?.calendar_ids ?? [],
      availability_open_hours: config?.availability?.participants?.[0]?.open_hours ?? [],
      booking_calendar_id: config?.event_booking?.organizer?.calendar_id || '',
      event_description:
        config?.event_booking?.description ??
        'A :duration minute initial consultation meeting with :participant_names',
      event_title:
        config?.event_booking?.title ?? ':duration minute consultation with :participant_names',
    })
  }, [isLoadingCalendars, isConfigLoading, config])

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)

    await updateUser(profile)

    if (typeof schedulingConfig !== 'undefined' && profile?.looking_for_work && profile?.grant_id) {
      await updateConfig(schedulingConfig)
    }

    setSaving(false)

    addToast('Profile updated', 'Successfully updated your profile.', 'success')
  }

  // This results in a white screen on first load
  if (isLoading) return null

  if (!user) {
    return window.location.replace('/login')
  }

  console.debug({ user, profile, schedulingConfig, config })

  return (
    <>
      <Head>
        <title>Profile - UpRocket</title>
        <meta
          name='description'
          content='Setup your profile and start connecting with professionals from all over the world.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col min-h-screen bg-white'>
        <Header />
        <div className='max-w-7xl p-[48px] mx-auto px-6 sm:px-6 lg:px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Profile</h1>
          {/* Form to configure contractor */}
          <form onSubmit={onSubmit} className='mt-6'>
            <div className='space-y-12'>
              <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
                <div>
                  <h2 className='text-base font-semibold leading-7 text-gray-900'>About you</h2>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>
                    This information will be displayed publicly so be careful what you share.
                  </p>
                </div>

                <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
                  <div className='sm:col-span-3'>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Full name
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='name'
                        id='name'
                        autoComplete='name'
                        value={profile?.name ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='title'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Title
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        name='title'
                        id='title'
                        autoComplete='title'
                        value={profile?.title ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, title: e.target.value }))}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Email address
                    </label>
                    <div className='mt-2'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        value={profile?.email ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='location'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Location
                    </label>
                    <div className='mt-2'>
                      <input
                        id='location'
                        name='location'
                        type='location'
                        autoComplete='location'
                        value={profile?.location ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                  </div>

                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='timezone'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Timezone
                    </label>
                    <div className='mt-2'>
                      <select
                        id='timezone'
                        name='timezone'
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                        value={profile?.timezone}
                        defaultValue={Intl.DateTimeFormat().resolvedOptions().timeZone}
                        onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                      >
                        {Object.keys(TIMEZONES).map((timezone) => (
                          <option key={timezone} value={timezone}>
                            {TIMEZONES[timezone]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className='sm:col-span-4'>
                    <label
                      htmlFor='website'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Website
                    </label>
                    <div className='mt-2'>
                      <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                        <span className='flex select-none items-center pl-3 text-gray-500 sm:text-sm'>
                          https://
                        </span>
                        <input
                          type='text'
                          name='website'
                          id='website'
                          value={profile?.website ?? ''}
                          onChange={(e) => setProfile((p) => ({ ...p, website: e.target.value }))}
                          className='block flex-1 border-0 bg-transparent p-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6'
                          placeholder='www.example.com'
                        />
                      </div>
                    </div>
                  </div>

                  <div className='col-span-full'>
                    <label
                      htmlFor='about'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      About
                    </label>
                    <div className='mt-2'>
                      <textarea
                        id='about'
                        name='about'
                        aria-describedby='about-description'
                        value={profile?.about ?? ''}
                        onChange={(e) => setProfile((p) => ({ ...p, about: e.target.value }))}
                        rows={3}
                        className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      />
                    </div>
                    <p className='mt-3 text-sm leading-6 text-gray-600'>
                      Write a few sentences about yourself.
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
                <div>
                  <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Job information
                  </h2>
                  <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Add details for the type of work you&apos;re looking for.
                  </p>
                </div>

                <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
                  <div className='max-w-2xl space-y-10 md:col-span-full'>
                    <fieldset>
                      <div className='mt-6 space-y-6'>
                        <div className='relative flex gap-x-3'>
                          <div className='flex h-6 items-center'>
                            <input
                              id='looking_for_work'
                              name='looking_for_work'
                              type='checkbox'
                              className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
                              checked={profile?.looking_for_work ?? false}
                              onChange={(e) =>
                                setProfile((p) => ({ ...p, looking_for_work: e.target.checked }))
                              }
                            />
                          </div>
                          <div className='text-sm leading-6'>
                            <label htmlFor='looking_for_work' className='font-medium text-gray-900'>
                              Looking for work
                            </label>
                            <p className='text-gray-500'>
                              Let employers know that you are looking for work.
                            </p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>

                  <div className='col-span-full'>
                    <label
                      htmlFor='skills'
                      className='block text-sm font-medium leading-6 text-gray-900'
                    >
                      Skills
                    </label>
                    <div className='text-sm leading-6'>
                      <p className='text-gray-500'>
                        Start typing to search for skills. Select up to 10 skills.
                      </p>
                    </div>
                    <div className='mt-2'>
                      {!isLoading && profile && (
                        <TagSelector
                          name={'skills'}
                          tags={SKILLS}
                          preSelectedTags={profile?.skills ?? []}
                          onTagChange={(skills) => setProfile((p) => ({ ...p, skills }))}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {profile?.looking_for_work && (
                <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Availability
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      Configure your availability for work.
                    </p>
                  </div>

                  {isConfigLoading ||
                    (isLoadingCalendars && (
                      <div className='max-w-2xl space-y-10 md:col-span-2'>
                        <div className='animate-pulse flex space-x-4'>
                          <div className='flex-1 space-y-4 py-1'>
                            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                            <div className='space-y-2'>
                              <div className='h-4 bg-gray-200 rounded'></div>
                              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {!isConfigLoading && !isLoadingCalendars && (
                    <div className='max-w-2xl space-y-10 md:col-span-2'>
                      {!user.grant_id && (
                        <div className='rounded-md bg-yellow-50 p-4'>
                          <div className='flex'>
                            <div className='flex-shrink-0'></div>
                            <div className='ml-3'>
                              <h3 className='text-sm font-medium text-yellow-800'>
                                You have not connected your calendar.
                              </h3>
                              <div className='mt-2 text-sm text-yellow-700'>
                                <p>You need to log into connect your calendar</p>
                              </div>
                              <div className='mt-2 text-sm text-yellow-700'>
                                <NylasProvider
                                  onLoggedIn={async (event) => {
                                    const provider = event.detail
                                    const auth = await provider.getNylasAuth()
                                    if (auth?.isAuthenticated) {
                                      const user = await auth.getTokenInfo()
                                      if (!user) {
                                        return
                                      }
                                      setProfile((p) => {
                                        const updatedProfile = {
                                          ...p,
                                          looking_for_worK: true,
                                          grant_id: user.grant_id,
                                        }
                                        return updatedProfile
                                      })

                                      await updateUser({ ...profile, grant_id: user.grant_id })
                                    }
                                  }}
                                  authConfig={{
                                    storageType: 'indexeddb',
                                    apiUri: NYLAS_AUTH_CONFIG.apiUri,
                                    elementsApiUri: NYLAS_AUTH_CONFIG.elementsApiUri,
                                    clientId: NYLAS_AUTH_CONFIG.clientId,
                                    redirectURI: window.origin + '/profile',
                                    defaultScopes: NYLAS_AUTH_CONFIG.defaultScopes,
                                  }}
                                >
                                  <NylasLogin
                                    buttonText={'Connect email'}
                                    onButtonClick={async () => {
                                      setProfile((p) => {
                                        const updatedProfile = { ...p, looking_for_worK: true }
                                        return updatedProfile
                                      })

                                      await updateUser({ ...profile })
                                    }}
                                  />
                                </NylasProvider>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {user.grant_id && (
                        <>
                          <div className='sm:col-span-3'>
                            <label
                              htmlFor='availability_calendar'
                              className='block text-sm font-medium leading-6 text-gray-900'
                            >
                              Availability calendar
                            </label>
                            <div className='mt-2'>
                              <select
                                id='availability_calendar'
                                name='availability_calendar'
                                autoComplete='availability-calendar-name'
                                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                                onChange={(e) => {
                                  setSchedulingConfig((v) => {
                                    const calendar_ids = Array.from(e.target.options)
                                      .filter((o) => o.selected)
                                      .map((o) => o.value)
                                    console.log({ calendar_ids })
                                    v.availability_calendar_ids = calendar_ids
                                    return v
                                  })
                                }}
                                defaultValue={schedulingConfig.availability_calendar_ids}
                                multiple={true}
                              >
                                {calendars?.map((calendar) => (
                                  <option key={calendar.id} value={calendar.id}>
                                    {calendar.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className='sm:col-span-3'>
                            <p className='block text-sm font-medium leading-6 text-gray-900'>
                              Configure your open hours
                            </p>
                            <div className='mt-2'>
                              <NylasOpenHoursPicker
                                openHours={config?.availability?.participants?.[0].open_hours ?? []}
                                onOpenHoursChanged={(e) => {
                                  setSchedulingConfig((v) => {
                                    v.availability_open_hours = e.detail
                                    return v
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {profile?.looking_for_work && user.grant_id && (
                <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3'>
                  <div>
                    <h2 className='text-base font-semibold leading-7 text-gray-900'>
                      Consultation booking
                    </h2>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>
                      Configure the consultation booking event.
                    </p>
                  </div>

                  {isConfigLoading ||
                    (isLoadingCalendars && (
                      <div className='max-w-2xl space-y-10 md:col-span-2'>
                        <div className='animate-pulse flex space-x-4'>
                          <div className='flex-1 space-y-4 py-1'>
                            <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                            <div className='space-y-2'>
                              <div className='h-4 bg-gray-200 rounded'></div>
                              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {!isConfigLoading && !isLoadingCalendars && (
                    <div className='max-w-2xl space-y-10 md:col-span-2'>
                      <div className='sm:col-span-3'>
                        <label
                          htmlFor='availability_calendar'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Booking calendar
                        </label>
                        <p className='text-gray-500'>
                          Select the calendar you want your consultation bookings to be added to.
                        </p>
                        <div className='mt-2'>
                          <select
                            id='organizer_calendar_id'
                            name='organizer_calendar_id'
                            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6'
                            onChange={(e) => {
                              setSchedulingConfig((v) => {
                                v.booking_calendar_id = e.target.value
                                return v
                              })
                            }}
                            defaultValue={schedulingConfig.booking_calendar_id}
                          >
                            {calendars?.map((calendar) => (
                              <option key={calendar.id} value={calendar.id}>
                                {calendar.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className='sm:col-span-4'>
                        <label
                          htmlFor='event_title'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Event title
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            name='event_title'
                            id='event_title'
                            autoComplete='event_title'
                            value={schedulingConfig.event_title ?? ''}
                            onChange={(e) =>
                              setSchedulingConfig((p) => ({ ...p, event_title: e.target.value }))
                            }
                            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                      </div>

                      <div className='col-span-full'>
                        <label
                          htmlFor='event_description'
                          className='block text-sm font-medium leading-6 text-gray-900'
                        >
                          Event description
                        </label>
                        <div className='mt-2'>
                          <textarea
                            id='event_description'
                            name='event_description'
                            aria-describedby='event-description'
                            value={schedulingConfig.event_description ?? ''}
                            onChange={(e) =>
                              setSchedulingConfig((p) => ({
                                ...p,
                                event_description: e.target.value,
                              }))
                            }
                            rows={3}
                            className='block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                          />
                        </div>
                        <p className='mt-3 text-sm leading-6 text-gray-600'>
                          Add a description for your consultation event. You can use placeholders
                          like <code>{':duration'}</code> and <code>{':participant_names'}</code> to
                          add the duration and participant names to the description.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className='mt-6 flex items-center justify-end gap-x-6'>
              <button
                type='button'
                className='text-sm font-semibold leading-6 text-gray-900'
                onClick={() => {
                  setProfile(user)
                }}
              >
                Reset
              </button>
              <button
                type='submit'
                disabled={saving}
                className='rounded-md bg-apple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-apple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-apple-600'
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </>
  )
}
