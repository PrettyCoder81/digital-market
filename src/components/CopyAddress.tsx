import React, { useState } from 'react';
import { IconButton, Tooltip, Typography, Box } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';

interface CopyAddressProps {
  address: string;
  label?: string;
  shorten?: boolean;
  size?: 'small' | 'medium' | 'large';
  showCopyButton?: boolean;
  copyLabel?: string;
}

export default function CopyAddress({
  address,
  label,
  shorten = true,
  size = 'medium',
  showCopyButton = true,
  copyLabel,
}: CopyAddressProps) {
  const [copied, setCopied] = useState(false);

  const displayAddress = shorten
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fontSize = size === 'small' ? '0.75rem' : size === 'large' ? '1rem' : '0.875rem';

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {label && (
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
          {label}
        </Typography>
      )}
      <Tooltip title={copied ? 'Copied!' : copyLabel || `Copy: ${address}`}>
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontFamily: 'monospace',
            fontSize,
            cursor: showCopyButton ? 'pointer' : 'default',
            userSelect: 'all',
            '&:hover': showCopyButton ? { color: 'primary.main' } : {},
          }}
          onClick={showCopyButton ? handleCopy : undefined}
        >
          {displayAddress}
        </Typography>
      </Tooltip>
      {showCopyButton && (
        <Tooltip title={copied ? 'Copied!' : 'Copy address'}>
          <IconButton
            size={size === 'small' ? 'small' : 'medium'}
            onClick={handleCopy}
            sx={{ p: size === 'small' ? 0.25 : 0.5 }}
          >
            {copied ? (
              <Check fontSize="inherit" sx={{ color: 'success.main' }} />
            ) : (
              <ContentCopy fontSize="inherit" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
