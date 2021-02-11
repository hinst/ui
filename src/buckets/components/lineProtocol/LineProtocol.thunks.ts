// Libraries
import {Dispatch} from 'react'
import axios from 'axios'

// Action Creators
import {
  setWriteStatus,
  setUploadStatus,
  setBody,
  Action,
} from 'src/buckets/components/lineProtocol/LineProtocol.creators'

// APIs
import {postWrite as apiPostWrite} from 'src/client'

// Types
import {RemoteDataState, WritePrecision} from 'src/types'

export const retrieveLineProtocolFromUrl = async (
  dispatch: Dispatch<Action>,
  baseUrl: string,
  params: {url: string}
) => {
  try {
    dispatch(setUploadStatus(RemoteDataState.Loading))
    const response = await axios.get(baseUrl, {
      params,
    })
    dispatch(setBody(response.data))
    dispatch(setUploadStatus(RemoteDataState.Done))
  } catch (err) {
    console.error(err)
  }
}

export const writeLineProtocolAction = async (
  dispatch: Dispatch<Action>,
  org: string,
  bucket: string,
  body: string,
  precision: WritePrecision
) => {
  try {
    dispatch(setWriteStatus(RemoteDataState.Loading))

    const resp = await apiPostWrite({
      data: body,
      query: {org, bucket, precision},
    })

    if (resp.status === 204) {
      dispatch(setWriteStatus(RemoteDataState.Done))
    } else if (resp.status === 429) {
      dispatch(
        setWriteStatus(
          RemoteDataState.Error,
          'Failed due to plan limits: read cardinality reached'
        )
      )
    } else if (resp.status === 403) {
      dispatch(setWriteStatus(RemoteDataState.Error, resp.data.message))
    } else {
      const message = resp?.data?.message || 'Failed to write data'
      if (resp?.data?.code === 'invalid') {
        dispatch(
          setWriteStatus(
            RemoteDataState.Error,
            'Failed to write data - invalid line protocol submitted'
          )
        )
      } else {
        dispatch(setWriteStatus(RemoteDataState.Error, message))
      }
      throw new Error(message)
    }
  } catch (error) {
    console.error(error)
  }
}
